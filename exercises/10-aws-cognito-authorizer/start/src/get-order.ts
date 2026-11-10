import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda'
import { findOrder } from './orders.ts'

// Starting point: anyone who knows an orderId can see the order.
// TODO: Read sub from event.requestContext.authorizer.jwt.claims and
//       return 404 if the order is missing or order.ownerId does not match.
export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (event) => {
  const order = await findOrder(event.pathParameters!.orderId!)
  return { statusCode: 200, body: JSON.stringify(order) }
}
