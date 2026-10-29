import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it } from 'vitest'
import { handler as listOrders } from '../src/list-orders.ts'
import { handler as placeOrder } from '../src/place-order.ts'

const db = mockClient(DynamoDBDocumentClient)
beforeEach(() => db.reset())

const call = async (h: typeof listOrders, event: Partial<APIGatewayProxyEventV2>) =>
  (await h(event as APIGatewayProxyEventV2, {} as Context, () => {})) as APIGatewayProxyStructuredResultV2

describe('POST /orders', () => {
  it('speichert die Bestellung und antwortet mit 201', async () => {
    db.on(PutCommand).resolves({})
    const response = await call(placeOrder, {
      body: JSON.stringify({ customerId: '42', items: [{ sku: 'BOOK', quantity: 1 }] }),
    })
    expect(response.statusCode).toBe(201)
    expect(db.commandCalls(PutCommand)[0]?.args[0].input.Item).toMatchObject({ pk: 'CUSTOMER#42' })
  })

  it('lehnt eine Bestellung ohne Artikel mit 400 ab', async () => {
    const response = await call(placeOrder, { body: JSON.stringify({ customerId: '42', items: [] }) })
    expect(response.statusCode).toBe(400)
    expect(db.commandCalls(PutCommand)).toHaveLength(0)
  })
})

describe('GET /orders', () => {
  it('liefert die Bestellungen eines Kunden per Query', async () => {
    db.on(QueryCommand).resolves({ Items: [{ orderId: 'A7' }] })
    const response = await call(listOrders, { queryStringParameters: { customerId: '42' } })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body ?? '')).toEqual([{ orderId: 'A7' }])
    expect(db.commandCalls(QueryCommand)[0]?.args[0].input.ExpressionAttributeValues).toMatchObject({ ':pk': 'CUSTOMER#42' })
  })

  it('verlangt eine customerId', async () => {
    expect((await call(listOrders, {})).statusCode).toBe(400)
  })
})
