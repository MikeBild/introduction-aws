import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it } from 'vitest'
import { handler } from '../src/get-order.ts'

const db = mockClient(DynamoDBDocumentClient)
beforeEach(() => {
  db.reset()
  db.on(GetCommand, { Key: { pk: 'ORDER#A7' } }).resolves({ Item: { pk: 'ORDER#A7', orderId: 'A7', ownerId: 'ada', items: [] } })
  db.on(GetCommand, { Key: { pk: 'ORDER#XX' } }).resolves({})
})

const getAs = async (sub: string, orderId: string) =>
  (await handler(
    {
      pathParameters: { orderId },
      requestContext: { authorizer: { jwt: { claims: { sub }, scopes: [] } } },
    } as unknown as APIGatewayProxyEventV2WithJWTAuthorizer,
    {} as Context,
    () => {},
  )) as APIGatewayProxyStructuredResultV2

describe('GET /orders/{orderId}', () => {
  it('returns your own order', async () => {
    const response = await getAs('ada', 'A7')
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body ?? '')).toEqual({ orderId: 'A7', ownerId: 'ada', items: [] })
  })

  it('responds with 404 for an order of another customer', async () => {
    expect((await getAs('grace', 'A7')).statusCode).toBe(404)
  })

  it('responds with 404 when the order does not exist', async () => {
    expect((await getAs('ada', 'XX')).statusCode).toBe(404)
  })
})
