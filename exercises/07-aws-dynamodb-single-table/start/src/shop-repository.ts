import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import type { Customer, Order, OrderLine, ShopItem } from './items.ts'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const tableName = () => process.env.TABLE_NAME

// Fertig: Kunde und Bestellungen in einer Query.
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

// TODO: Query auf pk = ORDER#id mit begins_with(sk, 'PRODUCT#')
export const getOrderLines = async (_orderId: string): Promise<OrderLine[]> => {
  throw new Error('TODO: getOrderLines implementieren')
}

// Ausgangslage: liest die ganze Table.
// TODO: Query auf einen Inverted Index GSI1 (Partition Key sk, Sort Key pk).
export const getOrdersOfProduct = async (productId: string) => {
  const { Items = [] } = await db.send(new ScanCommand({
    TableName: tableName(),
    FilterExpression: 'sk = :product AND begins_with(pk, :order)',
    ExpressionAttributeValues: { ':product': `PRODUCT#${productId}`, ':order': 'ORDER#' },
  }))
  return (Items as OrderLine[]).map((line) => ({ orderId: line.pk.slice('ORDER#'.length), quantity: line.quantity }))
}
