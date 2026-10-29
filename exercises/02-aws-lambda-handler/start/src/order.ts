import { z } from 'zod'

export type Order = {
  customerId: string
  items: { sku: string; price: number; quantity: number }[]
}

// TODO: Ersetze z.any() durch ein echtes Schema: customerId (nicht leer) und
// items (mindestens ein Eintrag, price >= 0, quantity ganzzahlig und > 0).
export const Order: z.ZodType<Order> = z.any()

export type OrderTotal = { customerId: string; items: number; total: number }

// TODO: Reine Function ohne Event und ohne AWS: Anzahl Artikel und Summe.
export const calculateTotal = (_order: Order): OrderTotal => {
  throw new Error('TODO: calculateTotal implementieren')
}
