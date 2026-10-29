import { fileURLToPath } from 'node:url'
import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { Architecture, LoggingFormat, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import type { Construct } from 'constructs'

export class ObservabilityStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    // Fehlgeschlagene asynchrone Aufrufe landen nach zwei Retries hier.
    const deadLetterQueue = new Queue(this, 'PlaceOrderDlq', { retentionPeriod: Duration.days(14) })

    // TODO: OpenTelemetry – adotInstrumentation mit AdotLayerVersion.fromJavaScriptSdkLayerVersion(...LATEST)
    //       und AdotLambdaExecWrapper.REGULAR_HANDLER, dazu tracing: Tracing.ACTIVE

    const placeOrder = new NodejsFunction(this, 'PlaceOrder', {
      entry: fileURLToPath(new URL('../src/place-order.ts', import.meta.url)),
      runtime: Runtime.NODEJS_24_X,
      architecture: Architecture.ARM_64,
      loggingFormat: LoggingFormat.JSON,
      deadLetterQueue,
      environment: {
        TABLE_NAME: table.tableName,
        POWERTOOLS_SERVICE_NAME: 'orders',
        POWERTOOLS_METRICS_NAMESPACE: 'Shop',
        POWERTOOLS_LOG_LEVEL: 'INFO',
      },
      bundling: { format: OutputFormat.ESM, minify: true, sourceMap: true },
    })
    table.grantWriteData(placeOrder)

    // TODO: SNS Topic 'Alarms' (optional E-Mail per -c alarmEmail=...)
    // TODO: Alarm auf placeOrder.metricErrors (5 Minuten, Schwelle 5)
    // TODO: Alarm auf deadLetterQueue.metricApproximateNumberOfMessagesVisible (Schwelle 1)

    new CfnOutput(this, 'PlaceOrderName', { value: placeOrder.functionName })
  }
}
