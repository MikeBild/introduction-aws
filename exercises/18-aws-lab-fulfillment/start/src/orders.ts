import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { Order } from './order.ts'

// Auf Modulebene: einmal pro Execution Environment.
export const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// Ein Ort für die Key-Formate (Übung 06): Bestellungen eines Kunden, neueste zuerst.
export const customerPk = (customerId: string) => `CUSTOMER#${customerId}`
export const orderSk = (createdAt: string, orderId: string) => `ORDER#${createdAt}#${orderId}`

export const saveOrder = async (order: Order) => {
  await db.send(new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: { pk: customerPk(order.customerId), sk: orderSk(order.createdAt, order.orderId), ...order },
    // Eine neue ID darf nie eine bestehende Bestellung überschreiben.
    ConditionExpression: 'attribute_not_exists(pk)',
  }))
  return order
}

export const listOrders = async (customerId: string, limit: number) => {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :order)',
    ExpressionAttributeValues: { ':pk': customerPk(customerId), ':order': 'ORDER#' },
    ScanIndexForward: false,
    Limit: limit,
  }))
  return Items.map(({ pk: _pk, sk: _sk, ...order }) => order as Order)
}
