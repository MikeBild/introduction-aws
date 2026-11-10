import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'

// Starting point: business logic in the handler, no validation of the body.
// TODO: Validate the body with parseOrder from order.ts – 400 with { message: 'invalid order' }
// TODO: Calculate the total with totalCents from order.ts and respond with 200
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const order = JSON.parse(event.body ?? '{}')
  const totalCents = order.items.reduce(
    (sum: number, item: { priceCents: number; quantity: number }) => sum + item.priceCents * item.quantity,
    0,
  )
  return { statusCode: 200, body: JSON.stringify({ totalCents }) }
}
