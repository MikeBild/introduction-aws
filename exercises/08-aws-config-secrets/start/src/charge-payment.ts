import { chargePayment, type PaymentEvent } from './payment.ts'

// Ausgangslage: API Key und Limit stehen im Klartext in Umgebungsvariablen.
// TODO: Beide mit getParameter aus '@aws-lambda-powertools/parameters/ssm' laden,
//       den API Key mit decrypt: true, beide mit maxAge: 300.
//       Die Namen stehen in API_KEY_PARAMETER und MAX_ITEMS_PARAMETER.
export const handler = async (event: PaymentEvent) =>
  chargePayment({
    apiKey: process.env.PAYMENT_API_KEY ?? '',
    limit: Number(process.env.MAX_ITEMS ?? 20),
    event,
  })
