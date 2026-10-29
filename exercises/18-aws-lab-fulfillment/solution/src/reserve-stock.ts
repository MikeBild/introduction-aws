import { PutCommand } from '@aws-sdk/lib-dynamodb'
import type { EventBridgeEvent, SQSBatchItemFailure, SQSHandler } from 'aws-lambda'
import type { OrderPlaced } from './events.ts'
import { db } from './orders.ts'

// Reine Fachlogik des Lagers (Übung 14). Wirft bei Produkten, die es nicht gibt.
export const reserveStock = (event: OrderPlaced) => {
  const unknown = event.items.filter((item) => item.productId.startsWith('UNKNOWN'))
  if (unknown.length) throw new Error(`Unbekannte Produkte: ${unknown.map((i) => i.productId).join(', ')}`)
  return { orderId: event.orderId, items: event.items.map(({ productId, quantity }) => ({ productId, quantity })) }
}

// Mindestens einmal zugestellt: Die Reservierung wird nur geschrieben, wenn es sie noch nicht gibt.
export const reserveOnce = async (event: OrderPlaced) => {
  const reservation = reserveStock(event)
  try {
    await db.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: { pk: `ORDER#${event.orderId}`, sk: 'RESERVATION', ...reservation, reservedAt: new Date().toISOString() },
      ConditionExpression: 'attribute_not_exists(pk)',
    }))
    return 'reserved' as const
  } catch (error) {
    if ((error as Error).name === 'ConditionalCheckFailedException') return 'duplicate' as const
    throw error
  }
}

// Partial Batch Response: Nur fehlgeschlagene Nachrichten kommen zurück in die Queue.
export const handler: SQSHandler = async (event) => {
  const batchItemFailures: SQSBatchItemFailure[] = []
  for (const record of event.Records) {
    try {
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
