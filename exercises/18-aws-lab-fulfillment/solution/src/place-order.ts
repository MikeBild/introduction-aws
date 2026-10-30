import { randomUUID } from 'node:crypto'
import { getParameter } from '@aws-lambda-powertools/parameters/ssm'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { publishOrderPlaced } from './events.ts'
import { parseOrder, placeOrder } from './order.ts'
import { saveOrder } from './orders.ts'

const FIVE_MINUTES = 300

// POST /orders – dünner Handler über Pure Functions.
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const input = parseOrder(event.body)
  if (!input)
    return { statusCode: 400, body: JSON.stringify({ message: 'invalid order' }) }
  // SecureString entschlüsselt laden und im Execution Environment cachen (Übung 08).
  const apiKey = await getParameter(process.env.API_KEY_PARAMETER!, { decrypt: true, maxAge: FIVE_MINUTES })
  const order = placeOrder(input, { orderId: randomUUID(), now: new Date(), apiKey: apiKey ?? '' })
  await saveOrder(order)
  // Erst speichern, dann veröffentlichen: Das Event beschreibt, was schon passiert ist.
  await publishOrderPlaced(order)
  return { statusCode: 201, body: JSON.stringify(order) }
}
