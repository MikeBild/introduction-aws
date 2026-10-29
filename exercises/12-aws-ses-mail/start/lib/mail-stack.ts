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

    // Per Context überschreiben: -c fromAddress=shop@deine-domain.de -c domain=deine-domain.de
    const domain: string = this.node.tryGetContext('domain') ?? 'example.com'
    const fromAddress: string = this.node.tryGetContext('fromAddress') ?? `shop@${domain}`
    const replyAddress = `reply@${domain}`

    // Absender verifizieren: SES schickt einen Bestätigungslink an diese Adresse.
    const sender = new EmailIdentity(this, 'Sender', { identity: Identity.email(fromAddress) })

    // TODO: CfnTemplate 'order-confirmed' mit Betreff, Text und HTML, Platzhalter {{orderId}} und {{total}}

    const fn = (id: string, file: string, environment: Record<string, string>) =>
      new NodejsFunction(this, id, {
        entry: fileURLToPath(new URL(`../src/${file}`, import.meta.url)),
        runtime: Runtime.NODEJS_24_X,
        architecture: Architecture.ARM_64,
        environment,
        bundling: { format: OutputFormat.ESM, minify: true },
      })

    // Ausgehend: Bestätigung per Template
    const sendConfirmation = fn('SendConfirmation', 'send-confirmation.ts', {
      FROM_ADDRESS: fromAddress,
      REPLY_TO_ADDRESS: replyAddress,
      TEMPLATE_NAME,
    })
    sender.grantSendEmail(sendConfirmation)
    // TODO: ses:SendEmail auch auf das Template erlauben (this.formatArn mit resource 'template')

    // TODO: Eingehend – Bucket für Rohmails, Function InboundMail (src/inbound-mail.ts)
    //       mit BUCKET_NAME und OBJECT_PREFIX, grantRead auf den Bucket,
    //       ReceiptRuleSet mit einer Rule für replyAddress: erst S3Action, dann LambdaAction.

    new CfnOutput(this, 'SendConfirmationName', { value: sendConfirmation.functionName })
  }
}
