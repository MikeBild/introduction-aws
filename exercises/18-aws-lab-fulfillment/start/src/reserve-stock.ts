import type { SQSHandler } from 'aws-lambda'
import type { OrderPlaced } from './events.ts'

// TODO (exercise 14): Throws for products whose ID starts with UNKNOWN.
export const reserveStock = (_event: OrderPlaced): { orderId: string; items: { productId: string; quantity: number }[] } => {
  throw new Error('TODO: reserveStock implementieren')
}

// TODO (exercise 14): PutCommand into the Orders table with pk 'ORDER#<orderId>', sk 'RESERVATION'
//      and ConditionExpression 'attribute_not_exists(pk)'. ConditionalCheckFailedException
//      (error.name) means: already reserved -> 'duplicate'.
export const reserveOnce = async (_event: OrderPlaced): Promise<'reserved' | 'duplicate'> => {
  throw new Error('TODO: reserveOnce implementieren')
}

// TODO (exercise 14): Loop with try/catch, failed messages into batchItemFailures.
export const handler: SQSHandler = async () => {
  throw new Error('TODO: ReserveStock implementieren')
}
