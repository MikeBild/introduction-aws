import { fileURLToPath } from 'node:url'
import { Stack, type StackProps } from 'aws-cdk-lib'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import type { Construct } from 'constructs'

export class PaymentsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    new NodejsFunction(this, 'ChargePayment', {
      entry: fileURLToPath(new URL('../src/charge-payment.ts', import.meta.url)),
      runtime: Runtime.NODEJS_24_X,
      architecture: Architecture.ARM_64,
      // Ausgangslage: der Key steht im Template und in der Lambda Console.
      // TODO: Nur Parameter-Namen übergeben (API_KEY_PARAMETER, MAX_ITEMS_PARAMETER)
      // TODO: SecureString per StringParameter.fromSecureStringParameterAttributes referenzieren
      // TODO: /orders/max-items als StringParameter anlegen
      // TODO: Leserechte mit grantRead vergeben
      environment: {
        PAYMENT_API_KEY: 'sk_test_nur_ein_beispiel',
        MAX_ITEMS: '20',
      },
      bundling: { format: OutputFormat.ESM, minify: true },
    })
  }
}
