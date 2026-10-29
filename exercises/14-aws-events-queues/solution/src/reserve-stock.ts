import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { EventBridgeEvent, SQSBatchItemFailure, SQSHandler } from 'aws-lambda'
import { type OrderPlaced, reserveStock } from './order.ts'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// SQS stellt mindestens einmal zu. Die Bestellnummer wird nur geschrieben, wenn es
// sie noch nicht gibt. Kommt dieselbe Bestellung zweimal, überspringen wir sie.
export const reserveOnce = async (event: OrderPlaced) => {
  const reservation = reserveStock(event)
  try {
    await db.send(new PutCommand({
      TableName: process.env.RESERVATIONS_TABLE_NAME,
      Item: { ...reservation, reservedAt: new Date().toISOString() },
      ConditionExpression: 'attribute_not_exists(orderId)',
    }))
    return 'reserved' as const
  } catch (error) {
    // Kein Fehler, sondern eine Wiederholung: nicht zurück in die Queue.
    if ((error as Error).name === 'ConditionalCheckFailedException') return 'duplicate' as const
    throw error
  }
}

// Partial Batch Response: Nur fehlgeschlagene Nachrichten kommen zurück in die Queue.
export const handler: SQSHandler = async (event) => {
  const batchItemFailures: SQSBatchItemFailure[] = []
  for (const record of event.Records) {
    try {
      // Die Rule leitet das ganze EventBridge-Event weiter. Die Bestellung steckt in detail.
      const message = JSON.parse(record.body) as EventBridgeEvent<'OrderPlaced', OrderPlaced>
      const result = await reserveOnce(message.detail)
      console.log(JSON.stringify({ orderId: message.detail.orderId, result }))
    } catch (error) {
      console.error(JSON.stringify({ messageId: record.messageId, error: (error as Error).message }))
      batchItemFailures.push({ itemIdentifier: record.messageId })
    }
  }
  return { batchItemFailures }
}
