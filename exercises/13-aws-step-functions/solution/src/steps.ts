// The steps of the workflow as small functions. Each file below is a Lambda entry.
export type OrderInput = {
  orderId: string
  amount: number
  items: { sku: string; quantity: number }[]
  // For the exercise only: forces an error at the payment provider.
  simulate?: 'timeout' | 'declined'
}

// Step Functions recognizes errors by name (errorType). Retry and Catch rely on it.
export class PaymentProviderTimeout extends Error {
  override name = 'PaymentProviderTimeout'
}
export class PaymentDeclined extends Error {
  override name = 'PaymentDeclined'
}

export const chargePayment = async (input: OrderInput) => {
  if (input.simulate === 'timeout') throw new PaymentProviderTimeout('Zahlungsanbieter antwortet nicht')
  if (input.simulate === 'declined' || input.amount > 1000) throw new PaymentDeclined(`Zahlung für ${input.orderId} abgelehnt`)
  return { paymentId: `PAY-${input.orderId}` }
}

export const checkStock = async (input: Pick<OrderInput, 'items'>) => ({
  available: input.items.every((item) => !item.sku.startsWith('OUT_OF_STOCK')),
})

export const shipOrder = async (input: Pick<OrderInput, 'orderId'>) => ({ trackingId: `TRACK-${input.orderId}` })

export const reorder = async (input: Pick<OrderInput, 'items'>) => ({
  reordered: input.items.filter((item) => item.sku.startsWith('OUT_OF_STOCK')).map((item) => item.sku),
})

export const cancelOrder = async (input: { orderId: string; error?: unknown }) => ({ orderId: input.orderId, status: 'CANCELLED' })
