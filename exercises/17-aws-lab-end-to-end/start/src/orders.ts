import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { Order } from './order.ts'

export const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// Key-Formate (Übung 06): Bestellungen eines Kunden, sortiert nach Datum.
export const customerPk = (customerId: string) => `CUSTOMER#${customerId}`
export const orderSk = (createdAt: string, orderId: string) => `ORDER#${createdAt}#${orderId}`

// TODO (Übung 05): PutCommand mit pk/sk und allen Feldern der Bestellung,
//      ConditionExpression 'attribute_not_exists(pk)'
export const saveOrder = async (_order: Order): Promise<Order> => {
  throw new Error('TODO: saveOrder implementieren')
}

// TODO (Übung 06): Query auf pk = CUSTOMER#id und begins_with(sk, 'ORDER#'), neueste zuerst,
//      pk und sk aus dem Ergebnis entfernen
export const listOrders = async (_customerId: string, _limit: number): Promise<Order[]> => {
  throw new Error('TODO: listOrders implementieren')
}
