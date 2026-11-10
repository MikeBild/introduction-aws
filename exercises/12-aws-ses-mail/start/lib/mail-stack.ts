import { fileURLToPath } from 'node:url'
import { CfnOutput, Stack, type StackProps } from 'aws-cdk-lib'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { EmailIdentity, Identity } from 'aws-cdk-lib/aws-ses'
import type { Construct } from 'constructs'

const TEMPLATE_NAME = 'order-confirmed'

export class MailStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Override via context: -c fromAddress=shop@deine-domain.de -c domain=deine-domain.de
    const domain: string = this.node.tryGetContext('domain') ?? 'example.com'
    const fromAddress: string = this.node.tryGetContext('fromAddress') ?? `shop@${domain}`
    const replyAddress = `reply@${domain}`

    // Verify the sender: SES sends a confirmation link to this address.
    const sender = new EmailIdentity(this, 'Sender', { identity: Identity.email(fromAddress) })

    // Receiving requires a verified domain. SES generates DKIM records for it,
    // which you add to your DNS (console: SES -> Identities -> your domain).
    new EmailIdentity(this, 'Domain', { identity: Identity.domain(domain) })

    // TODO: CfnTemplate 'order-confirmed' with subject, text and HTML, placeholders {{orderId}} and {{total}}

    const fn = (id: string, file: string, environment: Record<string, string>) =>
      new NodejsFunction(this, id, {
        entry: fileURLToPath(new URL(`../src/${file}`, import.meta.url)),
        runtime: Runtime.NODEJS_24_X,
        architecture: Architecture.ARM_64,
        environment,
        bundling: { format: OutputFormat.ESM, minify: true },
      })

    // Outbound: confirmation via template
    const sendConfirmation = fn('SendConfirmation', 'send-confirmation.ts', {
      FROM_ADDRESS: fromAddress,
      REPLY_TO_ADDRESS: replyAddress,
      TEMPLATE_NAME,
    })
    sender.grantSendEmail(sendConfirmation)
    // TODO: Allow ses:SendEmail on the template as well (this.formatArn with resource 'template')

    // TODO: Inbound – bucket for raw mails, function InboundMail (src/inbound-mail.ts)
    //       with BUCKET_NAME and OBJECT_PREFIX, grantRead on the bucket,
    //       ReceiptRuleSet with one rule for replyAddress: S3Action first, then LambdaAction.

    new CfnOutput(this, 'SendConfirmationName', { value: sendConfirmation.functionName })
  }
}
