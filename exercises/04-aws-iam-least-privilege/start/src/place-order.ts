import { randomUUID } from 'node:crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// Braucht nur Schreibrechte: PutItem auf die Orders Table.
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { customerId = 'unknown', ...order } = JSON.parse(event.body ?? '{}')
  const item = { pk: `CUSTOMER#${customerId}`, sk: `ORDER#${randomUUID()}`, ...order }
  await db.send(new PutCommand({ TableName: process.env.TABLE_NAME, Item: item }))
  return { statusCode: 201, body: JSON.stringify(item) }
}
