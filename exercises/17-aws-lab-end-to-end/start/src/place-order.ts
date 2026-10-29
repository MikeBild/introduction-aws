import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'

// POST /orders
// TODO: parseOrder (400 mit { message: 'invalid order' }), API Key per getParameter aus
//       '@aws-lambda-powertools/parameters/ssm' mit decrypt und maxAge laden (Übung 08),
//       placeOrder mit randomUUID() und new Date(), saveOrder, 201 mit der Bestellung.
export const handler: APIGatewayProxyHandlerV2 = async () =>
  ({ statusCode: 501, body: JSON.stringify({ message: 'TODO: POST /orders' }) })
