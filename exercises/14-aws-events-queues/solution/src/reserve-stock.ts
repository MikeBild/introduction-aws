import { BatchProcessor, EventType, processPartialResponse } from '@aws-lambda-powertools/batch'
import { IdempotencyConfig, makeIdempotent } from '@aws-lambda-powertools/idempotency'
import { DynamoDBPersistenceLayer } from '@aws-lambda-powertools/idempotency/dynamodb'
import type { EventBridgeEvent, SQSHandler, SQSRecord } from 'aws-lambda'
import { type OrderPlaced, reserveStock } from './order.ts'

const processor = new BatchProcessor(EventType.SQS)

// SQS liefert mindestens einmal. Gleiche orderId -> gleiches Ergebnis, kein zweites Reservieren.
const config = new IdempotencyConfig({ eventKeyJmesPath: 'orderId', expiresAfterSeconds: 3600 })
const reserveOnce = makeIdempotent(reserveStock, {
  persistenceStore: new DynamoDBPersistenceLayer({ tableName: process.env.IDEMPOTENCY_TABLE_NAME ?? 'idempotency' }),
  config,
})

// Die Rule leitet das ganze EventBridge-Event weiter. Die Bestellung steckt in detail.
const handleRecord = async (record: SQSRecord) => {
  const event = JSON.parse(record.body) as EventBridgeEvent<'OrderPlaced', OrderPlaced>
  return reserveOnce(event.detail)
}

// Partial Batch Response: nur fehlgeschlagene Nachrichten kommen zurück in die Queue.
export const handler: SQSHandler = async (event, context) => {
  config.registerLambdaContext(context)
  return processPartialResponse(event, handleRecord, processor, { context })
}
