import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'

// POST /orders
// TODO: parseOrder (400 with { message: 'invalid order' }), load the API key with getParameter from
//       '@aws-lambda-powertools/parameters/ssm' with decrypt and maxAge (exercise 08),
//       placeOrder with randomUUID() and new Date(), saveOrder, 201 with the order.
export const handler: APIGatewayProxyHandlerV2 = async () =>
  ({ statusCode: 501, body: JSON.stringify({ message: 'TODO: POST /orders' }) })
