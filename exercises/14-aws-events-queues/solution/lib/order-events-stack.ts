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

    // Produzent: Orders Service veröffentlicht OrderPlaced
    const bus = new EventBus(this, 'Orders', { eventBusName: 'orders' })
    const placeOrder = fn('PlaceOrder', 'publish.ts', { EVENT_BUS_NAME: bus.eventBusName })
    bus.grantPutEventsTo(placeOrder)

    // Konsument: Lager, entkoppelt über eine Queue mit Dead Letter Queue
    const deadLetterQueue = new Queue(this, 'StockDlq', { retentionPeriod: Duration.days(14) })
    const stockQueue = new Queue(this, 'StockQueue', {
      // Mindestens sechsmal so lang wie der Timeout der Function.
      visibilityTimeout: Duration.seconds(60),
      deadLetterQueue: { queue: deadLetterQueue, maxReceiveCount: 3 },
    })

    new Rule(this, 'OrderPlacedToStock', {
      eventBus: bus,
      eventPattern: { source: ['orders'], detailType: ['OrderPlaced'] },
      targets: [new SqsQueue(stockQueue)],
    })

    // Eine Reservierung pro Bestellnummer. Der Conditional Write verhindert doppelte Wirkung.
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
