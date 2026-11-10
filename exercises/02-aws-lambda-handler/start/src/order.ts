// Workshop shop: money always as whole cents, never as a decimal.
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = { customerId: string; items: OrderItem[] }

// TODO: Validate the body and return an order or undefined.
//       - broken JSON -> undefined (do not throw)
//       - customerId: non-empty string
//       - items: at least one line item
//       - productId not empty, quantity integer >= 1, priceCents integer >= 0
export const parseOrder = (_body: string | undefined): Order | undefined => {
  throw new Error('TODO: parseOrder implementieren')
}

// TODO: Pure Function without event and without AWS: Σ quantity × priceCents.
export const totalCents = (_order: Order): number => {
  throw new Error('TODO: totalCents implementieren')
}
