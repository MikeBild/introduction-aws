import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import type { OrderPlaced } from './events.ts'
import { customerPk, db, orderSk } from './orders.ts'

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

// Kompensation: Die Bestellung wechselt nur aus placed nach cancelled.
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
