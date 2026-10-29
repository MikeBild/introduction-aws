import type { Order } from './order.ts'

// Das Fakt nach dem Speichern. Die Keys der Bestellung stecken drin, damit spätere
// Schritte sie wiederfinden.
export type OrderPlaced = Pick<Order, 'orderId' | 'customerId' | 'createdAt' | 'totalCents' | 'items'>

// TODO (Übung 14): PutEventsCommand auf EVENT_BUS_NAME mit Source 'werkstatt.orders',
//      DetailType 'OrderPlaced' und dem OrderPlaced-Detail. FailedEntryCount prüfen.
//      Danach in place-order.ts nach saveOrder aufrufen.
export const publishOrderPlaced = async (_order: Order): Promise<void> => {
  throw new Error('TODO: publishOrderPlaced implementieren')
}
