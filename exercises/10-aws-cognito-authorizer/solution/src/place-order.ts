import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda'
import { saveOrder } from './orders.ts'

// Die ownerId kommt aus dem geprüften Token, nie aus dem Body.
// Ohne Authorizer gibt es keine Claims – dann landet 'anonymous' in der Table.
export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (event) => {
  const ownerId = (event.requestContext.authorizer?.jwt?.claims?.sub as string | undefined) ?? 'anonymous'
  const { items = [] } = JSON.parse(event.body ?? '{}')
  return { statusCode: 201, body: JSON.stringify(await saveOrder(ownerId, items)) }
}
