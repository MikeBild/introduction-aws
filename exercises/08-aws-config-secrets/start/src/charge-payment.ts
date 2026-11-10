import { chargePayment, type PaymentEvent } from './payment.ts'

// Starting point: API key and limit are in plain text in environment variables.
// TODO: Load both with getParameter from '@aws-lambda-powertools/parameters/ssm',
//       the API key with decrypt: true, both with maxAge: 300.
//       The names are in API_KEY_PARAMETER and MAX_ITEMS_PARAMETER.
export const handler = async (event: PaymentEvent) =>
  chargePayment({
    apiKey: process.env.PAYMENT_API_KEY ?? '',
    limit: Number(process.env.MAX_ITEMS ?? 20),
    event,
  })
