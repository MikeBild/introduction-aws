import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb'
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import type { Context, SQSBatchResponse, SQSEvent } from 'aws-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { OrderPlaced } from '../src/events.ts'
import { handler as reserveStock } from '../src/reserve-stock.ts'
import { formatEuro, handler as sendConfirmation } from '../src/send-confirmation.ts'
import { cancelOrder, chargePayment } from '../src/steps.ts'

vi.stubEnv('TABLE_NAME', 'orders')
vi.stubEnv('FROM_ADDRESS', 'shop@example.com')
vi.stubEnv('TO_ADDRESS', 'ich@example.com')
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})

const db = mockClient(DynamoDBDocumentClient)
const ses = mockClient(SESv2Client)
beforeEach(() => {
  db.reset()
  ses.reset()
  db.on(PutCommand).resolves({})
})

const placed = (orderId: string, productId = 'p-1', totalCents = 2598): OrderPlaced => ({
  orderId, customerId: 'c-1', createdAt: '2026-10-29T10:00:00.000Z', totalCents,
  items: [{ productId, quantity: 2, priceCents: 1299 }],
})
const message = (messageId: string, detail: OrderPlaced) =>
  ({ messageId, body: JSON.stringify({ 'detail-type': 'OrderPlaced', source: 'werkstatt.orders', detail }) })
const run = async (...records: ReturnType<typeof message>[]) =>
  (await reserveStock({ Records: records } as SQSEvent, {} as Context, () => {})) as SQSBatchResponse

describe('ReserveStock', () => {
  it('meldet nur die fehlgeschlagene Nachricht zurück', async () => {
    const response = await run(message('m-1', placed('A7')), message('m-2', placed('A8', 'UNKNOWN-1')))
    expect(response.batchItemFailures).toEqual([{ itemIdentifier: 'm-2' }])
  })

  it('reserviert per Conditional Write auf die Bestellnummer', async () => {
    await run(message('m-1', placed('A7')))
    expect(db.commandCalls(PutCommand)[0]?.args[0].input).toMatchObject({
      TableName: 'orders',
      Item: { pk: 'ORDER#A7', sk: 'RESERVATION' },
      ConditionExpression: 'attribute_not_exists(pk)',
    })
  })

  it('überspringt eine doppelte Zustellung', async () => {
    db.on(PutCommand).rejects(new ConditionalCheckFailedException({ message: 'gibt es schon', $metadata: {} }))
    expect((await run(message('m-1', placed('A7')))).batchItemFailures).toEqual([])
  })
})

describe('Schritte der State Machine', () => {
  it('bezahlt bis 1000 Euro und lehnt darüber mit PaymentDeclined ab', async () => {
    expect(await chargePayment(placed('A7'))).toEqual({ paymentId: 'PAY-A7' })
    await expect(chargePayment(placed('A9', 'p-1', 100_001))).rejects.toMatchObject({ name: 'PaymentDeclined' })
  })

  it('storniert nur eine Bestellung im Status placed', async () => {
    db.on(UpdateCommand).resolves({})
    expect(await cancelOrder(placed('A9'))).toEqual({ status: 'cancelled' })
    expect(db.commandCalls(UpdateCommand)[0]?.args[0].input).toMatchObject({
      Key: { pk: 'CUSTOMER#c-1', sk: 'ORDER#2026-10-29T10:00:00.000Z#A9' },
      ConditionExpression: '#status = :placed',
    })
  })

  it('schickt die Bestätigung an die verifizierte Adresse', async () => {
    ses.on(SendEmailCommand).resolves({ MessageId: 'mail-1' })
    expect(await sendConfirmation({ ...placed('A7'), trackingId: 'TRACK-A7' })).toEqual({ messageId: 'mail-1' })
    const input = ses.commandCalls(SendEmailCommand)[0]?.args[0].input
    expect(input?.Destination?.ToAddresses).toEqual(['ich@example.com'])
    expect(input?.Content?.Simple?.Subject?.Data).toBe('Bestellung A7 bestätigt')
    // Intl setzt ein geschütztes Leerzeichen vor das Euro-Zeichen.
    expect(formatEuro(2598)).toMatch(/^25,98\s€$/)
  })
})
