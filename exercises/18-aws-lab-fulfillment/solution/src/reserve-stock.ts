import { PutCommand } from '@aws-sdk/lib-dynamodb'
import type { EventBridgeEvent, SQSBatchItemFailure, SQSHandler } from 'aws-lambda'
import type { OrderPlaced } from './events.ts'
import { db } from './orders.ts'

// Pure business logic of the stock (exercise 14). Throws for products that do not exist.
export const reserveStock = (event: OrderPlaced) => {
  const unknown = event.items.filter((item) => item.productId.startsWith('UNKNOWN'))
  if (unknown.length) throw new Error(`Unbekannte Produkte: ${unknown.map((i) => i.productId).join(', ')}`)
  return { orderId: event.orderId, items: event.items.map(({ productId, quantity }) => ({ productId, quantity })) }
}

// Delivered at least once: the reservation is only written if it does not exist yet.
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

// Partial batch response: only failed messages go back to the queue.
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
