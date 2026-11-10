import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { Order } from './order.ts'

export const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// Key formats (exercise 06): orders of a customer, sorted by date.
export const customerPk = (customerId: string) => `CUSTOMER#${customerId}`
export const orderSk = (createdAt: string, orderId: string) => `ORDER#${createdAt}#${orderId}`

// TODO (exercise 05): PutCommand with pk/sk and all fields of the order,
//      ConditionExpression 'attribute_not_exists(pk)'
export const saveOrder = async (_order: Order): Promise<Order> => {
  throw new Error('TODO: saveOrder implementieren')
}

// TODO (exercise 06): Query on pk = CUSTOMER#id and begins_with(sk, 'ORDER#'), newest first,
//      remove pk and sk from the result
export const listOrders = async (_customerId: string, _limit: number): Promise<Order[]> => {
  throw new Error('TODO: listOrders implementieren')
}
