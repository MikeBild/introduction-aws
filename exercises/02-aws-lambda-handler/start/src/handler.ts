import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'

// Ausgangslage: Fachlogik im Handler, keine Prüfung des Bodys.
// TODO: Body mit parseOrder aus order.ts prüfen – 400 mit { message: 'invalid order' }
// TODO: Summe mit totalCents aus order.ts berechnen und mit 200 antworten
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const order = JSON.parse(event.body ?? '{}')
  const totalCents = order.items.reduce(
    (sum: number, item: { priceCents: number; quantity: number }) => sum + item.priceCents * item.quantity,
    0,
  )
  return { statusCode: 200, body: JSON.stringify({ totalCents }) }
}
