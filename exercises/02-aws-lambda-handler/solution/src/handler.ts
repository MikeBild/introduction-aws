import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { parseOrder, totalCents } from './order.ts'

// The handler stays thin: parse, validate, call the business logic, respond.
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const order = parseOrder(event.body)
  if (!order)
    return { statusCode: 400, body: JSON.stringify({ message: 'invalid order' }) }
  return { statusCode: 200, body: JSON.stringify({ totalCents: totalCents(order) }) }
}
