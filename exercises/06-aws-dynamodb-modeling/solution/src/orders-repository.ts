import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { customerPk, orderGsi1pk, PROFILE_SK, statusGsi2pk } from './keys.ts'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const tableName = () => process.env.TABLE_NAME

// 1: profile of a customer
export const getCustomerProfile = async (customerId: string) => {
  const { Item } = await db.send(new GetCommand({
    TableName: tableName(),
    Key: { pk: customerPk(customerId), sk: PROFILE_SK },
  }))
  return Item
}

// 2: orders of a customer, newest first
export const listOrdersOfCustomer = async (customerId: string, limit = 20) => {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: tableName(),
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :order)',
    ExpressionAttributeValues: { ':pk': customerPk(customerId), ':order': 'ORDER#' },
    ScanIndexForward: false,
    Limit: limit,
  }))
  return Items
}

// 3: orders of a customer in a date range (date in the format YYYY-MM-DD)
export const listOrdersInRange = async (customerId: string, from: string, to: string) => {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: tableName(),
    KeyConditionExpression: 'pk = :pk AND sk BETWEEN :from AND :to',
    // "~" sorts after all digits and "#": this way the whole last day is included.
    ExpressionAttributeValues: { ':pk': customerPk(customerId), ':from': `ORDER#${from}`, ':to': `ORDER#${to}~` },
  }))
  return Items
}

// 4: one order by orderId
export const getOrder = async (orderId: string) => {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: tableName(),
    IndexName: 'GSI1',
    KeyConditionExpression: 'gsi1pk = :pk',
    ExpressionAttributeValues: { ':pk': orderGsi1pk(orderId) },
    Limit: 1,
  }))
  return Items[0]
}

// 5: open orders, oldest first
export const listOpenOrders = async (limit = 50) => {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: tableName(),
    IndexName: 'GSI2',
    KeyConditionExpression: 'gsi2pk = :status',
    ExpressionAttributeValues: { ':status': statusGsi2pk('OPEN') },
    ScanIndexForward: true,
    Limit: limit,
  }))
  return Items
}
