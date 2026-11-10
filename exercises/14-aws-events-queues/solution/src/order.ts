// Workshop shop: money in whole cents.
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = { id: string; customerId: string; items: OrderItem[] }

// The event describes a fact in the past tense. The stock does not need prices.
export type OrderPlaced = {
  orderId: string
  customerId: string
  items: { productId: string; quantity: number }[]
}

export type Reservation = { orderId: string; items: OrderPlaced['items'] }

// Pure business logic of the stock. Throws for products that do not exist.
export const reserveStock = (event: OrderPlaced): Reservation => {
  const unknown = event.items.filter((item) => item.productId.startsWith('UNKNOWN'))
  if (unknown.length) throw new Error(`Unbekannte Produkte: ${unknown.map((i) => i.productId).join(', ')}`)
  return { orderId: event.orderId, items: event.items }
}
