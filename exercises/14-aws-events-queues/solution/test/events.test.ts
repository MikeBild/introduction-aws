import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb'
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { Context, SQSBatchResponse, SQSEvent } from 'aws-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { publishOrderPlaced } from '../src/publish.ts'
import { handler as reserveStock } from '../src/reserve-stock.ts'

vi.stubEnv('EVENT_BUS_NAME', 'orders')
vi.stubEnv('RESERVATIONS_TABLE_NAME', 'reservations')
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})

const events = mockClient(EventBridgeClient)
const db = mockClient(DynamoDBDocumentClient)
beforeEach(() => {
  events.reset()
  db.reset()
  db.on(PutCommand).resolves({})
})

const order = { id: 'A7', customerId: 'c-1', items: [{ productId: 'p-1', quantity: 2, priceCents: 1299 }] }
const message = (messageId: string, orderId: string, productId: string) => ({
  messageId,
  body: JSON.stringify({
    'detail-type': 'OrderPlaced',
    source: 'orders',
    detail: { orderId, customerId: 'c-1', items: [{ productId, quantity: 1 }] },
  }),
})
const run = async (...records: ReturnType<typeof message>[]) =>
  (await reserveStock({ Records: records } as SQSEvent, {} as Context, () => {})) as SQSBatchResponse

describe('publishOrderPlaced', () => {
  it('schickt OrderPlaced ohne Preise auf den Bus orders', async () => {
    events.on(PutEventsCommand).resolves({ FailedEntryCount: 0, Entries: [{ EventId: 'e-1' }] })
    expect(await publishOrderPlaced(order)).toBe('e-1')
    const entry = events.commandCalls(PutEventsCommand)[0]?.args[0].input.Entries?.[0]
    expect(entry).toMatchObject({ EventBusName: 'orders', Source: 'orders', DetailType: 'OrderPlaced' })
    expect(JSON.parse(entry?.Detail ?? '')).toEqual({ orderId: 'A7', customerId: 'c-1', items: [{ productId: 'p-1', quantity: 2 }] })
  })

  it('wirft, wenn EventBridge den Eintrag ablehnt', async () => {
    events.on(PutEventsCommand).resolves({ FailedEntryCount: 1, Entries: [{ ErrorMessage: 'kaputt' }] })
    await expect(publishOrderPlaced(order)).rejects.toThrow('kaputt')
  })
})

describe('reserveStock', () => {
  it('meldet nur die fehlgeschlagene Nachricht zurück', async () => {
    const response = await run(message('m-1', 'A7', 'p-1'), message('m-2', 'A8', 'UNKNOWN-1'), message('m-3', 'A9', 'p-2'))
    expect(response.batchItemFailures).toEqual([{ itemIdentifier: 'm-2' }])
    expect(db.commandCalls(PutCommand)).toHaveLength(2)
  })

  it('schreibt die Bestellnummer nur, wenn es sie noch nicht gibt', async () => {
    await run(message('m-1', 'A7', 'p-1'))
    const input = db.commandCalls(PutCommand)[0]?.args[0].input
    expect(input).toMatchObject({
      TableName: 'reservations',
      Item: { orderId: 'A7' },
      ConditionExpression: 'attribute_not_exists(orderId)',
    })
  })

  it('überspringt eine doppelte Zustellung, ohne sie zurückzumelden', async () => {
    db.on(PutCommand).rejects(new ConditionalCheckFailedException({ message: 'gibt es schon', $metadata: {} }))
    const response = await run(message('m-1', 'A7', 'p-1'))
    expect(response.batchItemFailures).toEqual([])
  })

  it('meldet echte DynamoDB-Fehler zurück', async () => {
    db.on(PutCommand).rejects(new Error('Throttling'))
    const response = await run(message('m-1', 'A7', 'p-1'))
    expect(response.batchItemFailures).toEqual([{ itemIdentifier: 'm-1' }])
  })
})
