// TODO: Entferne .skip, sobald Rule, DLQ, Partial Batch Response und Idempotency stehen.
import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import type { Context, SQSBatchResponse, SQSEvent } from 'aws-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { publishOrderPlaced } from '../src/publish.ts'
import { handler as reserveStock } from '../src/reserve-stock.ts'

vi.stubEnv('EVENT_BUS_NAME', 'orders')

const events = mockClient(EventBridgeClient)
// Die Idempotency-Persistenz schreibt in DynamoDB. Hier antwortet ein Mock.
const db = mockClient(DynamoDBClient)
beforeEach(() => {
  events.reset()
  db.reset()
  db.on(PutItemCommand).resolves({})
  db.on(UpdateItemCommand).resolves({})
})

const context = { functionName: 'ReserveStock', getRemainingTimeInMillis: () => 10_000, awsRequestId: 'req-1' } as Context
const message = (messageId: string, orderId: string, sku: string) => ({
  messageId,
  body: JSON.stringify({ 'detail-type': 'OrderPlaced', source: 'orders', detail: { orderId, total: 10, items: [{ sku, quantity: 1 }] } }),
})

describe.skip('publishOrderPlaced', () => {
  it('schickt OrderPlaced auf den Bus orders', async () => {
    events.on(PutEventsCommand).resolves({ FailedEntryCount: 0, Entries: [{ EventId: 'e-1' }] })
    expect(await publishOrderPlaced({ id: 'A7', total: 42, items: [] })).toBe('e-1')
    expect(events.commandCalls(PutEventsCommand)[0]?.args[0].input.Entries?.[0]).toMatchObject({
      EventBusName: 'orders', Source: 'orders', DetailType: 'OrderPlaced',
    })
  })

  it('wirft, wenn EventBridge den Eintrag ablehnt', async () => {
    events.on(PutEventsCommand).resolves({ FailedEntryCount: 1, Entries: [{ ErrorMessage: 'kaputt' }] })
    await expect(publishOrderPlaced({ id: 'A7', total: 42, items: [] })).rejects.toThrow('kaputt')
  })
})

describe.skip('reserveStock', () => {
  it('meldet nur die fehlgeschlagene Nachricht zurück', async () => {
    const event = { Records: [message('m-1', 'A7', 'BOOK'), message('m-2', 'A8', 'UNKNOWN-1'), message('m-3', 'A9', 'PEN')] } as SQSEvent
    const response = (await reserveStock(event, context, () => {})) as SQSBatchResponse
    expect(response.batchItemFailures).toEqual([{ itemIdentifier: 'm-2' }])
  })

  it('leitet den Idempotency Key aus der orderId ab', async () => {
    const run = (messageId: string, orderId: string) =>
      reserveStock({ Records: [message(messageId, orderId, 'BOOK')] } as SQSEvent, context, () => {})
    await run('m-1', 'A7')
    await run('m-2', 'A7')
    await run('m-3', 'A8')
    const ids = db.commandCalls(PutItemCommand).map((c) => c.args[0].input.Item?.id?.S)
    expect(db.commandCalls(PutItemCommand)[0]?.args[0].input.TableName).toBe('idempotency')
    expect(ids[0]).toBe(ids[1])
    expect(ids[0]).not.toBe(ids[2])
  })
})
