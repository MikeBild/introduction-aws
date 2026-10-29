// TODO: Entferne .skip, sobald Logger, Metrics, Tracing und Alarme stehen.
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import type { Context } from 'aws-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { handler, metrics } from '../src/place-order.ts'

// Ohne Dev-Modus schreibt der Logger eine JSON-Zeile pro Eintrag nach stdout.
vi.hoisted(() => {
  process.env.POWERTOOLS_DEV = 'false'
})

const db = mockClient(DynamoDBDocumentClient)
const context = { functionName: 'PlaceOrder', awsRequestId: 'req-1', getRemainingTimeInMillis: () => 1000 } as Context

// Powertools Logger schreibt JSON-Zeilen. Wir sammeln sie ein.
let lines: Record<string, unknown>[] = []
beforeEach(() => {
  db.reset()
  db.on(PutCommand).resolves({})
  lines = []
  const collect = (chunk: unknown) => {
    for (const line of String(chunk).split('\n').filter(Boolean)) {
      try {
        lines.push(JSON.parse(line))
      } catch {}
    }
    return true
  }
  // INFO geht nach stdout, ERROR nach stderr.
  vi.spyOn(process.stdout, 'write').mockImplementation(collect)
  vi.spyOn(process.stderr, 'write').mockImplementation(collect)
})
afterEach(() => vi.restoreAllMocks())

const event = { orderId: 'A7', customerId: '42', items: [{ sku: 'BOOK', quantity: 2 }], correlationId: 'corr-1' }

describe.skip('placeOrder', () => {
  it('loggt strukturiert mit orderId und Correlation ID', async () => {
    await handler(event, context)
    const placing = lines.find((l) => l.message === 'placing order')
    expect(placing).toMatchObject({ level: 'INFO', service: 'orders', orderId: 'A7', correlationId: 'corr-1', items: 1 })
  })

  it('schreibt fachliche Metriken', async () => {
    const addMetric = vi.spyOn(metrics, 'addMetric')
    await handler(event, context)
    expect(addMetric).toHaveBeenCalledWith('OrderPlaced', 'Count', 1)
    expect(addMetric).toHaveBeenCalledWith('ItemsOrdered', 'Count', 2)
  })

  it('loggt Fehler und zählt sie', async () => {
    const addMetric = vi.spyOn(metrics, 'addMetric')
    await expect(handler({ ...event, items: [] }, context)).rejects.toThrow('keine Artikel')
    expect(lines.find((l) => l.message === 'order failed')).toMatchObject({ level: 'ERROR', orderId: 'A7' })
    expect(addMetric).toHaveBeenCalledWith('OrderFailed', 'Count', 1)
  })
})
