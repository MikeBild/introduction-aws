import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// Needs read access only: Query on the Orders table.
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const customerId = event.queryStringParameters?.customerId ?? 'unknown'
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: { ':pk': `CUSTOMER#${customerId}` },
  }))
  return { statusCode: 200, body: JSON.stringify(Items) }
}
