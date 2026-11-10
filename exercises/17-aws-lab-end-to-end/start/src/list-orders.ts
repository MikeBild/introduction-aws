import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'

// GET /orders?customerId=c-1&limit=20
// TODO: 400 without customerId, limit at most 100, otherwise 200 with listOrders(customerId, limit).
export const handler: APIGatewayProxyHandlerV2 = async () =>
  ({ statusCode: 501, body: JSON.stringify({ message: 'TODO: GET /orders' }) })
