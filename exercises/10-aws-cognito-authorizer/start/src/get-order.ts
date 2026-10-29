import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda'
import { findOrder } from './orders.ts'

// Ausgangslage: jeder, der eine orderId kennt, sieht die Bestellung.
// TODO: sub aus event.requestContext.authorizer.jwt.claims lesen und
//       404 zurückgeben, wenn die Bestellung fehlt oder order.ownerId nicht passt.
export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (event) => {
  const order = await findOrder(event.pathParameters!.orderId!)
  return { statusCode: 200, body: JSON.stringify(order) }
}
