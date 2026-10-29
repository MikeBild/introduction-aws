import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import type { Order } from './order.ts'

const events = new EventBridgeClient({})

// Das Fakt nach dem Speichern. Die Keys der Bestellung stecken drin, damit spätere
// Schritte sie wiederfinden.
export type OrderPlaced = Pick<Order, 'orderId' | 'customerId' | 'createdAt' | 'totalCents' | 'items'>

export const publishOrderPlaced = async (order: Order) => {
  const { orderId, customerId, createdAt, totalCents, items } = order
  const detail: OrderPlaced = { orderId, customerId, createdAt, totalCents, items }
  const result = await events.send(new PutEventsCommand({
    Entries: [{
      EventBusName: process.env.EVENT_BUS_NAME,
      Source: 'werkstatt.orders',
      DetailType: 'OrderPlaced',
      Detail: JSON.stringify(detail),
    }],
  }))
  // PutEvents meldet Teilfehler im Ergebnis, nicht als Exception.
  if (result.FailedEntryCount) throw new Error(`OrderPlaced nicht veröffentlicht: ${result.Entries?.[0]?.ErrorMessage}`)
}
