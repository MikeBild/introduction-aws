import type { OrderPlaced } from './events.ts'

// Die Schritte der State Machine (Übung 13). Jede Datei steps-*.ts ist ein Lambda-Entry.

// Step Functions erkennt Fehler am Namen. Retry und Catch greifen darauf zu.
export class PaymentProviderTimeout extends Error {
  override name = 'PaymentProviderTimeout'
}
export class PaymentDeclined extends Error {
  override name = 'PaymentDeclined'
}

// Nur für die Übung: Bestellungen über 1000 Euro lehnt der Zahlungsanbieter ab.
export const LIMIT_CENTS = 100_000

export const chargePayment = async (order: OrderPlaced) => {
  if (order.totalCents > LIMIT_CENTS) throw new PaymentDeclined(`Zahlung für ${order.orderId} abgelehnt`)
  return { paymentId: `PAY-${order.orderId}` }
}

export const shipOrder = async (order: Pick<OrderPlaced, 'orderId'>) => ({ trackingId: `TRACK-${order.orderId}` })

// TODO: Kompensation. UpdateCommand auf den Key aus customerPk/orderSk (orders.ts):
//       status auf 'cancelled', nur wenn er 'placed' ist (ConditionExpression).
export const cancelOrder = async (_order: OrderPlaced & { error?: unknown }): Promise<{ status: string }> => {
  throw new Error('TODO: cancelOrder implementieren')
}
