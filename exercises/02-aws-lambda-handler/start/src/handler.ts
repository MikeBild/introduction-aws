import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'

// Ausgangslage: Fachlogik im Handler, keine Prüfung des Bodys.
// TODO: Body mit Order.safeParse prüfen (400 bei Fehlern)
// TODO: Summenberechnung nach calculateTotal in order.ts ziehen
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const order = JSON.parse(event.body ?? '{}')
  const total = order.items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0,
  )
  return { statusCode: 200, body: JSON.stringify({ total }) }
}
