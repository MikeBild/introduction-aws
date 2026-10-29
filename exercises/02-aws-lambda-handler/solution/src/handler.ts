import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { calculateTotal, Order } from './order.ts'

const parseJson = (body: string | undefined): unknown => {
  try {
    return JSON.parse(body ?? '{}')
  } catch {
    return undefined
  }
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const parsed = Order.safeParse(parseJson(event.body))
  if (!parsed.success)
    return { statusCode: 400, body: JSON.stringify(parsed.error.issues) }
  return { statusCode: 200, body: JSON.stringify(calculateTotal(parsed.data)) }
}
