import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { EventBridgeEvent, SQSHandler } from 'aws-lambda'
import { type OrderPlaced, reserveStock } from './order.ts'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// TODO: Bedingt schreiben: ConditionExpression 'attribute_not_exists(orderId)'.
//       Wirft DynamoDB ConditionalCheckFailedException (prüf error.name), gab es die
//       Bestellung schon: 'duplicate' zurückgeben statt zu werfen.
export const reserveOnce = async (event: OrderPlaced): Promise<'reserved' | 'duplicate'> => {
  const reservation = reserveStock(event)
  await db.send(new PutCommand({
    TableName: process.env.RESERVATIONS_TABLE_NAME,
    Item: { ...reservation, reservedAt: new Date().toISOString() },
  }))
  return 'reserved'
}

// Ausgangslage: Schlägt eine Nachricht fehl, kommt der ganze Batch zurück in die Queue –
// und bereits verarbeitete Bestellungen werden doppelt reserviert.
// TODO: Jede Nachricht in try/catch verarbeiten, fehlgeschlagene als
//       { itemIdentifier: record.messageId } sammeln und { batchItemFailures } zurückgeben.
export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body) as EventBridgeEvent<'OrderPlaced', OrderPlaced>
    await reserveOnce(message.detail)
  }
}
