import { randomUUID } from 'node:crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

export type Order = { orderId: string; ownerId: string; items: unknown[] }

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const findOrder = async (orderId: string) => {
  const { Item } = await db.send(new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: { pk: `ORDER#${orderId}` },
  }))
  return Item as (Order & { pk: string }) | undefined
}

export const saveOrder = async (ownerId: string, items: unknown[]) => {
  const order: Order = { orderId: randomUUID(), ownerId, items }
  await db.send(new PutCommand({ TableName: process.env.TABLE_NAME, Item: { pk: `ORDER#${order.orderId}`, ...order } }))
  return order
}
