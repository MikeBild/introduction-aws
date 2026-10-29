import { z } from 'zod'

export const OrderItem = z.object({
  sku: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
})

export const Order = z.object({
  customerId: z.string().min(1),
  items: z.array(OrderItem).min(1),
})

export type Order = z.infer<typeof Order>

export type OrderTotal = { customerId: string; items: number; total: number }

// Reine Fachlogik: kein Event, kein AWS, leicht zu testen.
export const calculateTotal = (order: Order): OrderTotal => ({
  customerId: order.customerId,
  items: order.items.reduce((sum, item) => sum + item.quantity, 0),
  total: Math.round(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100,
})
