// Werkstatt-Shop: Geld immer als ganze Cent.
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type OrderInput = { customerId: string; items: OrderItem[] }
export type Order = OrderInput & {
  orderId: string
  status: 'placed'
  totalCents: number
  createdAt: string
}

// TODO (Übung 02): parseOrder übernehmen – Bestellung oder undefined, auch bei kaputtem JSON.
export const parseOrder = (_body: string | undefined): OrderInput | undefined => {
  throw new Error('TODO: parseOrder aus Übung 02 übernehmen')
}

// TODO (Übung 02): Σ quantity × priceCents
export const totalCents = (_order: OrderInput): number => {
  throw new Error('TODO: totalCents aus Übung 02 übernehmen')
}

// TODO: Pure Function. Wirft ohne apiKey, sonst Bestellung im Status 'placed' mit
//       totalCents und createdAt als ISO-String aus now.
export const placeOrder = (_input: OrderInput, _deps: { orderId: string; now: Date; apiKey: string }): Order => {
  throw new Error('TODO: placeOrder implementieren')
}
