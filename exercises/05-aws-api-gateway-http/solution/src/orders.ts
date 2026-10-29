import { randomUUID } from 'node:crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { z } from 'zod'

export const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const PlaceOrderInput = z.object({
  customerId: z.string().min(1),
  items: z.array(z.object({ sku: z.string(), quantity: z.number().int().positive() })).min(1),
})
export type PlaceOrderInput = z.infer<typeof PlaceOrderInput>

export const saveOrder = async (input: PlaceOrderInput) => {
  const orderId = randomUUID()
  const item = { pk: `CUSTOMER#${input.customerId}`, sk: `ORDER#${orderId}`, orderId, ...input }
  await db.send(new PutCommand({ TableName: process.env.TABLE_NAME, Item: item }))
  return item
}

export const listOrders = async (customerId: string, limit: number) => {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :order)',
    ExpressionAttributeValues: { ':pk': `CUSTOMER#${customerId}`, ':order': 'ORDER#' },
    Limit: limit,
  }))
  return Items
}
