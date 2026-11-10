import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { EventBridgeEvent, SQSBatchItemFailure, SQSHandler } from 'aws-lambda'
import { type OrderPlaced, reserveStock } from './order.ts'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// SQS delivers at least once. The order number is only written if it
// does not exist yet. If the same order arrives twice, we skip it.
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
    // Not an error but a repeat: do not send it back to the queue.
    if ((error as Error).name === 'ConditionalCheckFailedException') return 'duplicate' as const
    throw error
  }
}

// Partial batch response: only failed messages go back to the queue.
export const handler: SQSHandler = async (event) => {
  const batchItemFailures: SQSBatchItemFailure[] = []
  for (const record of event.Records) {
    try {
      // The rule forwards the whole EventBridge event. The order is in detail.
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
