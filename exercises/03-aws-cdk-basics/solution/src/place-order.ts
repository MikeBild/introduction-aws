import { randomUUID } from 'node:crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const order = { pk: `ORDER#${randomUUID()}`, ...JSON.parse(event.body ?? '{}') }
  await db.send(new PutCommand({ TableName: process.env.TABLE_NAME, Item: order }))
  return { statusCode: 201, body: JSON.stringify(order) }
}
