import { fileURLToPath } from 'node:url'
import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch'
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import {
  AdotLambdaExecWrapper, AdotLambdaLayerJavaScriptSdkVersion, AdotLayerVersion, Architecture,
  LayerVersion, LoggingFormat, Runtime, Tracing,
} from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, type NodejsFunctionProps, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Topic } from 'aws-cdk-lib/aws-sns'
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions'
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

    // OpenTelemetry: Standard ist der ADOT-Layer, den CDK kennt. Mit
    // -c otelLayerArn=<ARN> nimmst du stattdessen den aktuellen Layer aus der AWS-Doku.
    const otelLayerArn: string | undefined = this.node.tryGetContext('otelLayerArn')
    const otel: Partial<NodejsFunctionProps> = otelLayerArn
      ? {
          layers: [LayerVersion.fromLayerVersionArn(this, 'OtelLayer', otelLayerArn)],
          environment: { AWS_LAMBDA_EXEC_WRAPPER: AdotLambdaExecWrapper.INSTRUMENT_HANDLER },
        }
      : {
          adotInstrumentation: {
            layerVersion: AdotLayerVersion.fromJavaScriptSdkLayerVersion(AdotLambdaLayerJavaScriptSdkVersion.LATEST),
            execWrapper: AdotLambdaExecWrapper.REGULAR_HANDLER,
          },
        }

    const placeOrder = new NodejsFunction(this, 'PlaceOrder', {
      ...otel,
      entry: fileURLToPath(new URL('../src/place-order.ts', import.meta.url)),
      runtime: Runtime.NODEJS_24_X,
      architecture: Architecture.ARM_64,
      tracing: Tracing.ACTIVE,
      loggingFormat: LoggingFormat.JSON,
      deadLetterQueue,
      environment: {
        ...otel.environment,
        TABLE_NAME: table.tableName,
        POWERTOOLS_SERVICE_NAME: 'orders',
        POWERTOOLS_METRICS_NAMESPACE: 'Shop',
        POWERTOOLS_LOG_LEVEL: 'INFO',
      },
      bundling: { format: OutputFormat.ESM, minify: true, sourceMap: true },
    })
    table.grantWriteData(placeOrder)

    // Alarme gehen an ein SNS Topic. Mit -c alarmEmail=du@example.com kommt eine Mail.
    const alarms = new Topic(this, 'Alarms')
    const alarmEmail: string | undefined = this.node.tryGetContext('alarmEmail')
    if (alarmEmail) alarms.addSubscription(new EmailSubscription(alarmEmail))

    const errors = placeOrder.metricErrors({ period: Duration.minutes(5) }).createAlarm(this, 'PlaceOrderErrors', {
      threshold: 5,
      evaluationPeriods: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
      alarmDescription: 'Mindestens fünf Fehler in fünf Minuten',
    })
    const dlqNotEmpty = deadLetterQueue.metricApproximateNumberOfMessagesVisible().createAlarm(this, 'OrdersDlqNotEmpty', {
      threshold: 1,
      evaluationPeriods: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
      alarmDescription: 'Nachrichten in der Dead Letter Queue',
    })
    for (const alarm of [errors, dlqNotEmpty]) alarm.addAlarmAction(new SnsAction(alarms))

    new CfnOutput(this, 'PlaceOrderName', { value: placeOrder.functionName })
  }
}
