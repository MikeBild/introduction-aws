import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import type { Order, OrderPlaced } from './order.ts'

const events = new EventBridgeClient({})

export const publishOrderPlaced = async (order: Order) => {
  const detail: OrderPlaced = { orderId: order.id, total: order.total, items: order.items }
  const result = await events.send(new PutEventsCommand({
    Entries: [{
      EventBusName: process.env.EVENT_BUS_NAME,
      Source: 'orders',
      DetailType: 'OrderPlaced',
      Detail: JSON.stringify(detail),
    }],
  }))
  // PutEvents meldet Teilfehler im Ergebnis, nicht als Exception.
  if (result.FailedEntryCount) throw new Error(`OrderPlaced nicht veröffentlicht: ${result.Entries?.[0]?.ErrorMessage}`)
  return result.Entries?.[0]?.EventId
}

// Zum Ausprobieren: aws lambda invoke mit einer Bestellung als Payload.
export const handler = async (order: Order) => ({ eventId: await publishOrderPlaced(order) })
