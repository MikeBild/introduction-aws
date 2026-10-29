export type PlaceOrderEvent = {
  orderId: string
  customerId: string
  items: { sku: string; quantity: number }[]
  correlationId?: string
}

export const validate = (event: PlaceOrderEvent) => {
  if (!event.items?.length) throw new Error(`Bestellung ${event.orderId} hat keine Artikel`)
  return event.items.reduce((sum, item) => sum + item.quantity, 0)
}
