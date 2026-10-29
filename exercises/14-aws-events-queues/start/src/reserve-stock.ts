import type { EventBridgeEvent, SQSHandler } from 'aws-lambda'
import { type OrderPlaced, reserveStock } from './order.ts'

// Ausgangslage: Schlägt eine Nachricht fehl, kommt der ganze Batch zurück in die Queue –
// und bereits verarbeitete Bestellungen werden doppelt reserviert.
// TODO: BatchProcessor + processPartialResponse aus '@aws-lambda-powertools/batch'
// TODO: reserveStock mit makeIdempotent absichern: DynamoDBPersistenceLayer mit
//       IDEMPOTENCY_TABLE_NAME, IdempotencyConfig({ eventKeyJmesPath: 'orderId' })
export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body) as EventBridgeEvent<'OrderPlaced', OrderPlaced>
    await reserveStock(message.detail)
  }
}
