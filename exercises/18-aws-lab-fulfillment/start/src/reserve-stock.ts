import type { SQSHandler } from 'aws-lambda'
import type { OrderPlaced } from './events.ts'

// TODO (Übung 14): Wirft bei Produkten, deren ID mit UNKNOWN beginnt.
export const reserveStock = (_event: OrderPlaced): { orderId: string; items: { productId: string; quantity: number }[] } => {
  throw new Error('TODO: reserveStock implementieren')
}

// TODO (Übung 14): PutCommand in die Orders Table mit pk 'ORDER#<orderId>', sk 'RESERVATION'
//      und ConditionExpression 'attribute_not_exists(pk)'. ConditionalCheckFailedException
//      (error.name) heißt: schon reserviert -> 'duplicate'.
export const reserveOnce = async (_event: OrderPlaced): Promise<'reserved' | 'duplicate'> => {
  throw new Error('TODO: reserveOnce implementieren')
}

// TODO (Übung 14): Schleife mit try/catch, fehlgeschlagene Nachrichten in batchItemFailures.
export const handler: SQSHandler = async () => {
  throw new Error('TODO: ReserveStock implementieren')
}
