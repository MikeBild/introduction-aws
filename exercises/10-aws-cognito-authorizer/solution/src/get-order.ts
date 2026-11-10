import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda'
import { findOrder } from './orders.ts'

const notFound = { statusCode: 404, body: JSON.stringify({ message: 'not found' }) }

// The authorizer has verified the token. Whether the signed-in person may see THIS order
// is decided by the handler. 404 instead of 403 does not reveal that the order exists.
export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (event) => {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string
  const order = await findOrder(event.pathParameters!.orderId!)
  if (!order || order.ownerId !== userId) return notFound
  const { pk: _pk, ...body } = order
  return { statusCode: 200, body: JSON.stringify(body) }
}
