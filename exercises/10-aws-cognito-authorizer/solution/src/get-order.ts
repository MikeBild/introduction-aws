import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda'
import { findOrder } from './orders.ts'

const notFound = { statusCode: 404, body: JSON.stringify({ message: 'not found' }) }

// Der Authorizer hat das Token geprüft. Ob die angemeldete Person DIESE Bestellung sehen darf,
// entscheidet der Handler. 404 statt 403 verrät nicht, dass die Bestellung existiert.
export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (event) => {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string
  const order = await findOrder(event.pathParameters!.orderId!)
  if (!order || order.ownerId !== userId) return notFound
  const { pk: _pk, ...body } = order
  return { statusCode: 200, body: JSON.stringify(body) }
}
