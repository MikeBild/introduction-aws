// Workshop shop: money always as whole cents, never as a decimal.
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = { customerId: string; items: OrderItem[] }

const isText = (value: unknown): value is string => typeof value === 'string' && value.length > 0
const isWhole = (value: unknown, min: number): value is number => Number.isInteger(value) && (value as number) >= min

const isItem = (value: unknown): value is OrderItem => {
  const item = value as Partial<OrderItem> | null
  return isText(item?.productId) && isWhole(item?.quantity, 1) && isWhole(item?.priceCents, 0)
}

// Validates the body and returns an order or undefined – also for broken JSON.
export const parseOrder = (body: string | undefined): Order | undefined => {
  let data: unknown
  try {
    data = JSON.parse(body ?? '')
  } catch {
    return undefined
  }
  const order = data as Partial<Order> | null
  if (!isText(order?.customerId)) return undefined
  if (!Array.isArray(order.items) || order.items.length === 0 || !order.items.every(isItem)) return undefined
  return { customerId: order.customerId, items: order.items.map(({ productId, quantity, priceCents }) => ({ productId, quantity, priceCents })) }
}

// Pure business logic: no event, no AWS, easy to test.
export const totalCents = (order: Order): number =>
  order.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)
