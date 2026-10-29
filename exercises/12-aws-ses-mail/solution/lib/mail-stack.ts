import { fileURLToPath } from 'node:url'
import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3'
import { CfnTemplate, EmailIdentity, Identity, ReceiptRuleSet } from 'aws-cdk-lib/aws-ses'
import { Lambda as LambdaAction, LambdaInvocationType, S3 as S3Action } from 'aws-cdk-lib/aws-ses-actions'
import type { Construct } from 'constructs'

const TEMPLATE_NAME = 'order-confirmed'
const OBJECT_PREFIX = 'inbound/'

export class MailStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Per Context überschreiben: -c fromAddress=shop@deine-domain.de -c domain=deine-domain.de
    const domain: string = this.node.tryGetContext('domain') ?? 'example.com'
    const fromAddress: string = this.node.tryGetContext('fromAddress') ?? `shop@${domain}`
    const replyAddress = `reply@${domain}`

    // Absender verifizieren: SES schickt einen Bestätigungslink an diese Adresse.
    const sender = new EmailIdentity(this, 'Sender', { identity: Identity.email(fromAddress) })

    // Empfang setzt eine verifizierte Domain voraus. SES erzeugt dafür DKIM-Einträge,
    // die du in deinem DNS anlegst (Console: SES -> Identities -> deine Domain).
    new EmailIdentity(this, 'Domain', { identity: Identity.domain(domain) })

    new CfnTemplate(this, 'OrderConfirmed', {
      template: {
        templateName: TEMPLATE_NAME,
        subjectPart: 'Bestellung {{orderId}} bestätigt',
        textPart: 'Danke für deine Bestellung {{orderId}} über {{total}} EUR. Antworte einfach auf diese Mail, wenn du Fragen hast.',
        htmlPart: '<p>Danke für deine Bestellung <strong>{{orderId}}</strong> über {{total}} EUR.</p><p>Antworte einfach auf diese Mail, wenn du Fragen hast.</p>',
      },
    })

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
    sendConfirmation.addToRolePolicy(new PolicyStatement({
      actions: ['ses:SendEmail'],
      resources: [this.formatArn({ service: 'ses', resource: 'template', resourceName: TEMPLATE_NAME })],
    }))

    // Eingehend: Receipt Rule -> S3 (Rohmail) -> Lambda (Verarbeitung)
    const inboundBucket = new Bucket(this, 'InboundBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })
    const inboundMail = fn('InboundMail', 'inbound-mail.ts', {
      BUCKET_NAME: inboundBucket.bucketName,
      OBJECT_PREFIX,
    })
    inboundBucket.grantRead(inboundMail)

    const ruleSet = new ReceiptRuleSet(this, 'Inbound')
    ruleSet.addRule('Replies', {
      recipients: [replyAddress],
      scanEnabled: true,
      actions: [
        new S3Action({ bucket: inboundBucket, objectKeyPrefix: OBJECT_PREFIX }),
        new LambdaAction({ function: inboundMail, invocationType: LambdaInvocationType.EVENT }),
      ],
    })

    new CfnOutput(this, 'SendConfirmationName', { value: sendConfirmation.functionName })
    new CfnOutput(this, 'ReceiptRuleSetName', { value: ruleSet.receiptRuleSetName })
    new CfnOutput(this, 'InboundBucketName', { value: inboundBucket.bucketName })
  }
}
