// TODO: Entferne .skip, sobald parseOrder und totalCents stehen.
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'
import { describe, expect, it } from 'vitest'
import { handler } from '../src/handler.ts'

const invoke = async (body?: string) =>
  (await handler({ body } as APIGatewayProxyEventV2, {} as Context, () => {})) as APIGatewayProxyStructuredResultV2

describe.skip('handler', () => {
  it('antwortet mit 200 und der Summe in Cent', async () => {
    const response = await invoke(JSON.stringify({ customerId: 'c-1', items: [{ productId: 'p-1', quantity: 3, priceCents: 1000 }] }))
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body ?? '')).toEqual({ totalCents: 3000 })
  })

  it('antwortet mit 400 bei ungültiger Bestellung', async () => {
    const response = await invoke(JSON.stringify({ customerId: 'c-1' }))
    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body ?? '')).toEqual({ message: 'invalid order' })
  })

  it('antwortet mit 400 bei kaputtem JSON', async () => {
    expect((await invoke('{kein json')).statusCode).toBe(400)
  })
})
