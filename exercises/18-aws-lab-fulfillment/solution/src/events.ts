import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import type { Order } from './order.ts'

const events = new EventBridgeClient({})

// The fact after saving. The keys of the order are included so that later
// steps can find it again.
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
  // PutEvents reports partial failures in the result, not as an exception.
  if (result.FailedEntryCount) throw new Error(`OrderPlaced nicht veröffentlicht: ${result.Entries?.[0]?.ErrorMessage}`)
}
