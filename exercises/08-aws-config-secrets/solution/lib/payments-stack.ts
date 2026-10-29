import { fileURLToPath } from 'node:url'
import { Stack, type StackProps } from 'aws-cdk-lib'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import type { Construct } from 'constructs'

export class PaymentsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // CloudFormation kann keine SecureStrings anlegen. Du legst den Wert per CLI an
    // (siehe README), der Stack referenziert ihn nur über den Namen.
    const apiKeyName = this.node.tryGetContext('apiKeyParameter') ?? '/orders/payments/api-key'
    const apiKey = StringParameter.fromSecureStringParameterAttributes(this, 'PaymentApiKey', {
      parameterName: apiKeyName,
    })

    // Unkritische Konfiguration darf der Stack selbst anlegen.
    const maxItems = new StringParameter(this, 'MaxItems', {
      parameterName: '/orders/max-items',
      stringValue: '20',
    })

    const chargePayment = new NodejsFunction(this, 'ChargePayment', {
      entry: fileURLToPath(new URL('../src/charge-payment.ts', import.meta.url)),
      runtime: Runtime.NODEJS_24_X,
      architecture: Architecture.ARM_64,
      environment: {
        // Nur Namen, keine Werte: im Template und in der Console steht kein Secret.
        API_KEY_PARAMETER: apiKeyName,
        MAX_ITEMS_PARAMETER: maxItems.parameterName,
      },
      bundling: { format: OutputFormat.ESM, minify: true },
    })

    // ssm:GetParameter auf genau diese Parameter. SecureStrings mit dem
    // AWS-verwalteten Key aws/ssm brauchen keine eigene KMS-Berechtigung.
    apiKey.grantRead(chargePayment)
    maxItems.grantRead(chargePayment)
  }
}
