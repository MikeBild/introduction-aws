export type PaymentEvent = { orderId: string; amount: number; items: number }
export type PaymentResult = { orderId: string; status: 'CHARGED' | 'REJECTED'; reason?: string }

// Pure business logic. The API key comes in as an argument, not from process.env.
export const chargePayment = ({ apiKey, limit, event }: { apiKey: string; limit: number; event: PaymentEvent }): PaymentResult => {
  if (!apiKey) throw new Error('API Key fehlt. Leg den SecureString /orders/payments/api-key per CLI an.')
  if (event.items > limit) return { orderId: event.orderId, status: 'REJECTED', reason: `mehr als ${limit} Artikel` }
  // This is where the payment provider would be called with apiKey.
  return { orderId: event.orderId, status: 'CHARGED' }
}
