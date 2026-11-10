import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import type { Order, OrderPlaced } from './order.ts'

const events = new EventBridgeClient({})

export const publishOrderPlaced = async (order: Order) => {
  const detail: OrderPlaced = {
    orderId: order.id,
    customerId: order.customerId,
    items: order.items.map(({ productId, quantity }) => ({ productId, quantity })),
  }
  const result = await events.send(new PutEventsCommand({
    Entries: [{
      EventBusName: process.env.EVENT_BUS_NAME,
      Source: 'orders',
      DetailType: 'OrderPlaced',
      Detail: JSON.stringify(detail),
    }],
  }))
  // PutEvents reports partial failures in the result, not as an exception.
  if (result.FailedEntryCount) throw new Error(`OrderPlaced nicht veröffentlicht: ${result.Entries?.[0]?.ErrorMessage}`)
  return result.Entries?.[0]?.EventId
}

// To try it out: aws lambda invoke with an order as payload.
export const handler = async (order: Order) => ({ eventId: await publishOrderPlaced(order) })
