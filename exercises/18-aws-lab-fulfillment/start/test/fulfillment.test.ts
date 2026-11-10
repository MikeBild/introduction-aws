// TODO: Remove .skip once the respective part is in place.
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

describe.skip('ReserveStock', () => {
  it('reports only the failed message back', async () => {
    const response = await run(message('m-1', placed('A7')), message('m-2', placed('A8', 'UNKNOWN-1')))
    expect(response.batchItemFailures).toEqual([{ itemIdentifier: 'm-2' }])
  })

  it('reserves with a conditional write on the order number', async () => {
    await run(message('m-1', placed('A7')))
    expect(db.commandCalls(PutCommand)[0]?.args[0].input).toMatchObject({
      TableName: 'orders',
      Item: { pk: 'ORDER#A7', sk: 'RESERVATION' },
      ConditionExpression: 'attribute_not_exists(pk)',
    })
  })

  it('skips a duplicate delivery', async () => {
    db.on(PutCommand).rejects(new ConditionalCheckFailedException({ message: 'gibt es schon', $metadata: {} }))
    expect((await run(message('m-1', placed('A7')))).batchItemFailures).toEqual([])
  })
})

describe.skip('Steps of the state machine', () => {
  it('charges up to 1000 euros and declines above with PaymentDeclined', async () => {
    expect(await chargePayment(placed('A7'))).toEqual({ paymentId: 'PAY-A7' })
    await expect(chargePayment(placed('A9', 'p-1', 100_001))).rejects.toMatchObject({ name: 'PaymentDeclined' })
  })

  it('cancels only an order in status placed', async () => {
    db.on(UpdateCommand).resolves({})
    expect(await cancelOrder(placed('A9'))).toEqual({ status: 'cancelled' })
    expect(db.commandCalls(UpdateCommand)[0]?.args[0].input).toMatchObject({
      Key: { pk: 'CUSTOMER#c-1', sk: 'ORDER#2026-10-29T10:00:00.000Z#A9' },
      ConditionExpression: '#status = :placed',
    })
  })

  it('sends the confirmation to the verified address', async () => {
    ses.on(SendEmailCommand).resolves({ MessageId: 'mail-1' })
    expect(await sendConfirmation({ ...placed('A7'), trackingId: 'TRACK-A7' })).toEqual({ messageId: 'mail-1' })
    const input = ses.commandCalls(SendEmailCommand)[0]?.args[0].input
    expect(input?.Destination?.ToAddresses).toEqual(['ich@example.com'])
    expect(input?.Content?.Simple?.Subject?.Data).toBe('Bestellung A7 bestätigt')
    // Intl puts a non-breaking space before the euro sign.
    expect(formatEuro(2598)).toMatch(/^25,98\s€$/)
  })
})
