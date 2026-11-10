import type { OrderPlaced } from './events.ts'

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

// TODO: Compensation. UpdateCommand on the key from customerPk/orderSk (orders.ts):
//       status to 'cancelled', only if it is 'placed' (ConditionExpression).
export const cancelOrder = async (_order: OrderPlaced & { error?: unknown }): Promise<{ status: string }> => {
  throw new Error('TODO: cancelOrder implementieren')
}
