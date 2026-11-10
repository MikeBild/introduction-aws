// Workshop shop: money always as whole cents.
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type OrderInput = { customerId: string; items: OrderItem[] }
export type Order = OrderInput & {
  orderId: string
  status: 'placed'
  totalCents: number
  createdAt: string
}

// TODO (exercise 02): Take over parseOrder – order or undefined, also for broken JSON.
export const parseOrder = (_body: string | undefined): OrderInput | undefined => {
  throw new Error('TODO: parseOrder aus Übung 02 übernehmen')
}

// TODO (exercise 02): Σ quantity × priceCents
export const totalCents = (_order: OrderInput): number => {
  throw new Error('TODO: totalCents aus Übung 02 übernehmen')
}

// TODO: Pure Function. Throws without apiKey, otherwise an order in status 'placed' with
//       totalCents and createdAt as ISO string from now.
export const placeOrder = (_input: OrderInput, _deps: { orderId: string; now: Date; apiKey: string }): Order => {
  throw new Error('TODO: placeOrder implementieren')
}
