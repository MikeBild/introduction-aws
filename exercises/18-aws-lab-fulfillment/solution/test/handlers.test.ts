import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { clearCaches } from '@aws-lambda-powertools/parameters'
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handler as listOrders } from '../src/list-orders.ts'
import { handler as placeOrder } from '../src/place-order.ts'

vi.stubEnv('TABLE_NAME', 'orders')
vi.stubEnv('API_KEY_PARAMETER', '/werkstatt/payments/api-key')
vi.stubEnv('EVENT_BUS_NAME', 'werkstatt')

const db = mockClient(DynamoDBDocumentClient)
const ssm = mockClient(SSMClient)
const events = mockClient(EventBridgeClient)
beforeEach(() => {
  db.reset()
  ssm.reset()
  events.reset()
  events.on(PutEventsCommand).resolves({ FailedEntryCount: 0, Entries: [{ EventId: 'e-1' }] })
  clearCaches()
  ssm.on(GetParameterCommand).resolves({ Parameter: { Value: 'test-key' } })
})

const call = async (h: typeof listOrders, event: Partial<APIGatewayProxyEventV2>) =>
  (await h(event as APIGatewayProxyEventV2, {} as Context, () => {})) as APIGatewayProxyStructuredResultV2

const body = JSON.stringify({ customerId: 'c-1', items: [{ productId: 'p-1', quantity: 2, priceCents: 1299 }] })

describe('POST /orders', () => {
  it('speichert die Bestellung unter dem Kunden und antwortet mit 201', async () => {
    db.on(PutCommand).resolves({})
    const response = await call(placeOrder, { body })
    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.body ?? '')).toMatchObject({ customerId: 'c-1', status: 'placed', totalCents: 2598 })
    const input = db.commandCalls(PutCommand)[0]?.args[0].input
    expect(input?.TableName).toBe('orders')
    expect(input?.Item).toMatchObject({ pk: 'CUSTOMER#c-1', sk: expect.stringMatching(/^ORDER#/) })
  })

  it('veröffentlicht OrderPlaced nach dem Speichern', async () => {
    db.on(PutCommand).resolves({})
    await call(placeOrder, { body })
    const entry = events.commandCalls(PutEventsCommand)[0]?.args[0].input.Entries?.[0]
    expect(entry).toMatchObject({ EventBusName: 'werkstatt', Source: 'werkstatt.orders', DetailType: 'OrderPlaced' })
    expect(JSON.parse(entry?.Detail ?? '')).toMatchObject({ customerId: 'c-1', totalCents: 2598 })
  })

  it('veröffentlicht nichts, wenn das Speichern scheitert', async () => {
    db.on(PutCommand).rejects(new Error('Throttling'))
    await expect(call(placeOrder, { body })).rejects.toThrow('Throttling')
    expect(events.commandCalls(PutEventsCommand)).toHaveLength(0)
  })

  it('lädt den API Key entschlüsselt und nur einmal', async () => {
    db.on(PutCommand).resolves({})
    await call(placeOrder, { body })
    await call(placeOrder, { body })
    expect(ssm.commandCalls(GetParameterCommand)).toHaveLength(1)
    expect(ssm.commandCalls(GetParameterCommand)[0]?.args[0].input).toMatchObject({
      Name: '/werkstatt/payments/api-key', WithDecryption: true,
    })
  })

  it('lehnt eine ungültige Bestellung mit 400 ab, ohne zu schreiben', async () => {
    const response = await call(placeOrder, { body: JSON.stringify({ customerId: 'c-1', items: [] }) })
    expect(response.statusCode).toBe(400)
    expect(db.commandCalls(PutCommand)).toHaveLength(0)
  })
})

describe('GET /orders', () => {
  it('liefert die Bestellungen eines Kunden ohne Keys', async () => {
    db.on(QueryCommand).resolves({ Items: [{ pk: 'CUSTOMER#c-1', sk: 'ORDER#x', orderId: 'A7' }] })
    const response = await call(listOrders, { queryStringParameters: { customerId: 'c-1' } })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body ?? '')).toEqual([{ orderId: 'A7' }])
    expect(db.commandCalls(QueryCommand)[0]?.args[0].input).toMatchObject({
      ExpressionAttributeValues: { ':pk': 'CUSTOMER#c-1', ':order': 'ORDER#' },
      ScanIndexForward: false,
    })
  })

  it('verlangt eine customerId', async () => {
    expect((await call(listOrders, {})).statusCode).toBe(400)
  })
})
