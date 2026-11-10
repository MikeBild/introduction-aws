import { fileURLToPath } from 'node:url'
import { Stack, type StackProps } from 'aws-cdk-lib'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import type { Construct } from 'constructs'

export class PaymentsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // CloudFormation cannot create SecureStrings. You create the value via the CLI
    // (see README), the stack only references it by name.
    const apiKeyName = this.node.tryGetContext('apiKeyParameter') ?? '/orders/payments/api-key'
    const apiKey = StringParameter.fromSecureStringParameterAttributes(this, 'PaymentApiKey', {
      parameterName: apiKeyName,
    })

    // Non-sensitive configuration may be created by the stack itself.
    const maxItems = new StringParameter(this, 'MaxItems', {
      parameterName: '/orders/max-items',
      stringValue: '20',
    })

    const chargePayment = new NodejsFunction(this, 'ChargePayment', {
      entry: fileURLToPath(new URL('../src/charge-payment.ts', import.meta.url)),
      runtime: Runtime.NODEJS_24_X,
      architecture: Architecture.ARM_64,
      environment: {
        // Names only, no values: no secret in the template or in the console.
        API_KEY_PARAMETER: apiKeyName,
        MAX_ITEMS_PARAMETER: maxItems.parameterName,
      },
      bundling: { format: OutputFormat.ESM, minify: true },
    })

    // ssm:GetParameter on exactly these parameters. SecureStrings with the
    // AWS-managed key aws/ssm need no separate KMS permission.
    apiKey.grantRead(chargePayment)
    maxItems.grantRead(chargePayment)
  }
}
