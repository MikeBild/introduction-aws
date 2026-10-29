import { getParameter } from '@aws-lambda-powertools/parameters/ssm'
import { chargePayment, type PaymentEvent } from './payment.ts'

const FIVE_MINUTES = 300

export const handler = async (event: PaymentEvent) => {
  // SecureString: entschlüsselt laden, fünf Minuten im Execution Environment cachen.
  const apiKey = await getParameter(process.env.API_KEY_PARAMETER!, { decrypt: true, maxAge: FIVE_MINUTES })
  const limit = await getParameter(process.env.MAX_ITEMS_PARAMETER!, { maxAge: FIVE_MINUTES })
  return chargePayment({ apiKey: apiKey!, limit: Number(limit), event })
}
