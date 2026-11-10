import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { EventBridgeEvent, SQSHandler } from 'aws-lambda'
import { type OrderPlaced, reserveStock } from './order.ts'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// TODO: Bedingt schreiben: ConditionExpression 'attribute_not_exists(orderId)'.
//       If DynamoDB throws ConditionalCheckFailedException (check error.name), the order
//       already existed: return 'duplicate' instead of throwing.
export const reserveOnce = async (event: OrderPlaced): Promise<'reserved' | 'duplicate'> => {
  const reservation = reserveStock(event)
  await db.send(new PutCommand({
    TableName: process.env.RESERVATIONS_TABLE_NAME,
    Item: { ...reservation, reservedAt: new Date().toISOString() },
  }))
  return 'reserved'
}

// Starting point: if one message fails, the whole batch goes back to the queue –
// and orders that were already processed get reserved twice.
// TODO: Process each message in try/catch, collect failed ones as
//       { itemIdentifier: record.messageId } and return { batchItemFailures }.
export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body) as EventBridgeEvent<'OrderPlaced', OrderPlaced>
    await reserveOnce(message.detail)
  }
}
