import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { Customer, Order, OrderLine, ShopItem } from './items.ts'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const tableName = () => process.env.TABLE_NAME

// Customer and their orders in one query: an item collection under CUSTOMER#id.
export const getCustomerWithOrders = async (customerId: string) => {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: tableName(),
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: { ':pk': `CUSTOMER#${customerId}` },
    ScanIndexForward: false,
  }))
  const items = Items as ShopItem[]
  return {
    customer: items.find((i): i is Customer => i.type === 'Customer'),
    orders: items.filter((i): i is Order => i.type === 'Order'),
  }
}

// Line items of an order: pk ORDER#id / sk PRODUCT#id
export const getOrderLines = async (orderId: string) => {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: tableName(),
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :product)',
    ExpressionAttributeValues: { ':pk': `ORDER#${orderId}`, ':product': 'PRODUCT#' },
  }))
  return Items as OrderLine[]
}

// Orders of a product: the inverted index GSI1 swaps pk and sk.
export const getOrdersOfProduct = async (productId: string) => {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: tableName(),
    IndexName: 'GSI1',
    KeyConditionExpression: 'sk = :product AND begins_with(pk, :order)',
    ExpressionAttributeValues: { ':product': `PRODUCT#${productId}`, ':order': 'ORDER#' },
  }))
  return (Items as OrderLine[]).map((line) => ({ orderId: line.pk.slice('ORDER#'.length), quantity: line.quantity }))
}
