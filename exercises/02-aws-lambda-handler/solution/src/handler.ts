import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { parseOrder, totalCents } from './order.ts'

// Der Handler bleibt dünn: parsen, prüfen, Fachlogik aufrufen, antworten.
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const order = parseOrder(event.body)
  if (!order)
    return { statusCode: 400, body: JSON.stringify({ message: 'invalid order' }) }
  return { statusCode: 200, body: JSON.stringify({ totalCents: totalCents(order) }) }
}
