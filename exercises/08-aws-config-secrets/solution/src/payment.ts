export type PaymentEvent = { orderId: string; amount: number; items: number }
export type PaymentResult = { orderId: string; status: 'CHARGED' | 'REJECTED'; reason?: string }

// Reine Fachlogik. Der API Key kommt als Argument, nicht aus process.env.
export const chargePayment = ({ apiKey, limit, event }: { apiKey: string; limit: number; event: PaymentEvent }): PaymentResult => {
  if (!apiKey) throw new Error('API Key fehlt')
  if (event.items > limit) return { orderId: event.orderId, status: 'REJECTED', reason: `mehr als ${limit} Artikel` }
  // Hier würde der Zahlungsanbieter mit apiKey aufgerufen.
  return { orderId: event.orderId, status: 'CHARGED' }
}
