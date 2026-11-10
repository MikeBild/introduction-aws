import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import type { OrderPlaced } from './events.ts'
import { customerPk, db, orderSk } from './orders.ts'

// The steps of the state machine (exercise 13). Each steps-*.ts file is a Lambda entry.

// Step Functions recognizes errors by name. Retry and Catch rely on it.
export class PaymentProviderTimeout extends Error {
  override name = 'PaymentProviderTimeout'
}
export class PaymentDeclined extends Error {
  override name = 'PaymentDeclined'
}

// For the exercise only: the payment provider declines orders above 1000 euros.
export const LIMIT_CENTS = 100_000

export const chargePayment = async (order: OrderPlaced) => {
  if (order.totalCents > LIMIT_CENTS) throw new PaymentDeclined(`Zahlung für ${order.orderId} abgelehnt`)
  return { paymentId: `PAY-${order.orderId}` }
}

export const shipOrder = async (order: Pick<OrderPlaced, 'orderId'>) => ({ trackingId: `TRACK-${order.orderId}` })

// Compensation: the order only moves from placed to cancelled.
export const cancelOrder = async (order: OrderPlaced & { error?: unknown }) => {
  await db.send(new UpdateCommand({
    TableName: process.env.TABLE_NAME,
    Key: { pk: customerPk(order.customerId), sk: orderSk(order.createdAt, order.orderId) },
    UpdateExpression: 'SET #status = :cancelled',
    ConditionExpression: '#status = :placed',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':cancelled': 'cancelled', ':placed': 'placed' },
  }))
  return { status: 'cancelled' }
}
