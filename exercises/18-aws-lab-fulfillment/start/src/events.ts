import type { Order } from './order.ts'

// The fact after saving. The keys of the order are included so that later
// steps can find it again.
export type OrderPlaced = Pick<Order, 'orderId' | 'customerId' | 'createdAt' | 'totalCents' | 'items'>

// TODO (exercise 14): PutEventsCommand on EVENT_BUS_NAME with Source 'werkstatt.orders',
//      DetailType 'OrderPlaced' and the OrderPlaced detail. Check FailedEntryCount.
//      Then call it in place-order.ts after saveOrder.
export const publishOrderPlaced = async (_order: Order): Promise<void> => {
  throw new Error('TODO: publishOrderPlaced implementieren')
}
