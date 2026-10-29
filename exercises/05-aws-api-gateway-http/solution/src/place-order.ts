import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { PlaceOrderInput, saveOrder } from './orders.ts'

// POST /orders
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  let body: unknown
  try {
    body = JSON.parse(event.body ?? '{}')
  } catch {
    return { statusCode: 400, body: JSON.stringify({ message: 'Der Body ist kein gültiges JSON. Schick die Bestellung als JSON-Objekt.' }) }
  }
  const parsed = PlaceOrderInput.safeParse(body)
  if (!parsed.success)
    return { statusCode: 400, body: JSON.stringify(parsed.error.issues) }
  return { statusCode: 201, body: JSON.stringify(await saveOrder(parsed.data)) }
}
