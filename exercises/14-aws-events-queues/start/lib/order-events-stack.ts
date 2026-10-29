import { fileURLToPath } from 'node:url'
import { CfnOutput, Duration, Stack, type StackProps } from 'aws-cdk-lib'
import { EventBus } from 'aws-cdk-lib/aws-events'
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

    // Konsument: Lager
    const stockQueue = new Queue(this, 'StockQueue', {
      visibilityTimeout: Duration.seconds(60),
      // TODO: Dead Letter Queue nach drei Fehlversuchen
    })

    // TODO: Rule auf dem Bus: source 'orders', detailType 'OrderPlaced' -> SqsQueue(stockQueue)

    // TODO: Table Reservations (Partition Key orderId), RESERVATIONS_TABLE_NAME an die Funktion,
    //       Schreibrechte per grantWriteData
    const reserveStock = fn('ReserveStock', 'reserve-stock.ts', {})
    reserveStock.addEventSource(new SqsEventSource(stockQueue, {
      batchSize: 10,
      // TODO: reportBatchItemFailures einschalten
    }))

    new CfnOutput(this, 'PlaceOrderName', { value: placeOrder.functionName })
  }
}
