// Werkstatt-Shop: Geld in ganzen Cent.
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = { id: string; customerId: string; items: OrderItem[] }

// Das Event beschreibt ein Fakt in der Vergangenheitsform. Preise braucht das Lager nicht.
export type OrderPlaced = {
  orderId: string
  customerId: string
  items: { productId: string; quantity: number }[]
}

export type Reservation = { orderId: string; items: OrderPlaced['items'] }

// Reine Fachlogik des Lagers. Wirft bei Produkten, die es nicht gibt.
export const reserveStock = (event: OrderPlaced): Reservation => {
  const unknown = event.items.filter((item) => item.productId.startsWith('UNKNOWN'))
  if (unknown.length) throw new Error(`Unbekannte Produkte: ${unknown.map((i) => i.productId).join(', ')}`)
  return { orderId: event.orderId, items: event.items }
}
