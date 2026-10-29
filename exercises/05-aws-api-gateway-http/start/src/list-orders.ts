import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { listOrders } from './orders.ts'

// GET /orders?customerId=42&limit=20
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const customerId = event.queryStringParameters?.customerId
  if (!customerId)
    return { statusCode: 400, body: JSON.stringify({ message: 'customerId fehlt' }) }
  const limit = Math.min(Number(event.queryStringParameters?.limit ?? 20), 100)
  return { statusCode: 200, body: JSON.stringify(await listOrders(customerId, limit)) }
}
