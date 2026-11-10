import { fileURLToPath } from 'node:url'
import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { EventBus, Rule } from 'aws-cdk-lib/aws-events'
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import type { Construct } from 'constructs'

export class OrderEventsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const fn = (id: string, file: string, environment: Record<string, string>) =>
      new NodejsFunction(this, id, {
        entry: fileURLToPath(new URL(`../src/${file}`, import.meta.url)),
        runtime: Runtime.NODEJS_24_X,
        architecture: Architecture.ARM_64,
        timeout: Duration.seconds(10),
        environment,
        bundling: { format: OutputFormat.ESM, minify: true },
      })

    // Producer: the orders service publishes OrderPlaced
    const bus = new EventBus(this, 'Orders', { eventBusName: 'orders' })
    const placeOrder = fn('PlaceOrder', 'publish.ts', { EVENT_BUS_NAME: bus.eventBusName })
    bus.grantPutEventsTo(placeOrder)

    // Consumer: stock, decoupled through a queue with a dead letter queue
    const deadLetterQueue = new Queue(this, 'StockDlq', { retentionPeriod: Duration.days(14) })
    const stockQueue = new Queue(this, 'StockQueue', {
      // At least six times the timeout of the function.
      visibilityTimeout: Duration.seconds(60),
      deadLetterQueue: { queue: deadLetterQueue, maxReceiveCount: 3 },
    })

    new Rule(this, 'OrderPlacedToStock', {
      eventBus: bus,
      eventPattern: { source: ['orders'], detailType: ['OrderPlaced'] },
      targets: [new SqsQueue(stockQueue)],
    })

    // One reservation per order number. The conditional write prevents a duplicate effect.
    const reservations = new TableV2(this, 'Reservations', {
      partitionKey: { name: 'orderId', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    })
    const reserveStock = fn('ReserveStock', 'reserve-stock.ts', { RESERVATIONS_TABLE_NAME: reservations.tableName })
    reservations.grantWriteData(reserveStock)
    reserveStock.addEventSource(new SqsEventSource(stockQueue, {
      batchSize: 10,
      reportBatchItemFailures: true,
    }))

    new CfnOutput(this, 'PlaceOrderName', { value: placeOrder.functionName })
    new CfnOutput(this, 'DeadLetterQueueUrl', { value: deadLetterQueue.queueUrl })
  }
}
