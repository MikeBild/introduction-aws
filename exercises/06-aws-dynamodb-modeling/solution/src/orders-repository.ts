import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { customerPk, orderGsi1pk, PROFILE_SK, statusGsi2pk } from './keys.ts'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const tableName = () => process.env.TABLE_NAME

// 1: Profil eines Kunden
export const getCustomerProfile = async (customerId: string) => {
  const { Item } = await db.send(new GetCommand({
    TableName: tableName(),
    Key: { pk: customerPk(customerId), sk: PROFILE_SK },
  }))
  return Item
}

// 2: Bestellungen eines Kunden, neueste zuerst
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

// 3: Bestellungen eines Kunden im Zeitraum (Datum im Format YYYY-MM-DD)
export const listOrdersInRange = async (customerId: string, from: string, to: string) => {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: tableName(),
    KeyConditionExpression: 'pk = :pk AND sk BETWEEN :from AND :to',
    // "~" sortiert hinter allen Ziffern und "#": so zählt der ganze letzte Tag mit.
    ExpressionAttributeValues: { ':pk': customerPk(customerId), ':from': `ORDER#${from}`, ':to': `ORDER#${to}~` },
  }))
  return Items
}

// 4: Eine Bestellung per orderId
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

// 5: Offene Bestellungen, älteste zuerst
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
