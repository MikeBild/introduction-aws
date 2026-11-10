// Workshop shop: money always as whole cents. From exercise 02, extended with placeOrder.
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type OrderInput = { customerId: string; items: OrderItem[] }
export type Order = OrderInput & {
  orderId: string
  status: 'placed'
  totalCents: number
  createdAt: string
}

const isText = (value: unknown): value is string => typeof value === 'string' && value.length > 0
const isWhole = (value: unknown, min: number): value is number => Number.isInteger(value) && (value as number) >= min

const isItem = (value: unknown): value is OrderItem => {
  const item = value as Partial<OrderItem> | null
  return isText(item?.productId) && isWhole(item?.quantity, 1) && isWhole(item?.priceCents, 0)
}

// Validates the body and returns an order or undefined – also for broken JSON.
export const parseOrder = (body: string | undefined): OrderInput | undefined => {
  let data: unknown
  try {
    data = JSON.parse(body ?? '')
  } catch {
    return undefined
  }
  const order = data as Partial<OrderInput> | null
  if (!isText(order?.customerId)) return undefined
  if (!Array.isArray(order.items) || order.items.length === 0 || !order.items.every(isItem)) return undefined
  return { customerId: order.customerId, items: order.items.map(({ productId, quantity, priceCents }) => ({ productId, quantity, priceCents })) }
}

export const totalCents = (order: OrderInput): number =>
  order.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)

// Pure business logic: ID and time come from outside so tests can pin them.
// The API key stands for the payment provider. If it is missing, the configuration is broken.
export const placeOrder = (input: OrderInput, { orderId, now, apiKey }: { orderId: string; now: Date; apiKey: string }): Order => {
  if (!apiKey) throw new Error('API Key für den Zahlungsanbieter fehlt. Leg den SecureString /werkstatt/payments/api-key per CLI an.')
  return { ...input, orderId, status: 'placed', totalCents: totalCents(input), createdAt: now.toISOString() }
}
