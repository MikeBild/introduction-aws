import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'
import { describe, expect, it } from 'vitest'
import { handler } from '../src/handler.ts'

const invoke = async (body?: string) =>
  (await handler({ body } as APIGatewayProxyEventV2, {} as Context, () => {})) as APIGatewayProxyStructuredResultV2

describe('handler', () => {
  it('antwortet mit 200 und der Summe', async () => {
    const response = await invoke(JSON.stringify({ customerId: 'c-42', items: [{ sku: 'BOOK', price: 10, quantity: 3 }] }))
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body ?? '')).toMatchObject({ total: 30 })
  })

  it('antwortet mit 400 bei ungültiger Bestellung', async () => {
    const response = await invoke(JSON.stringify({ customerId: 'c-42' }))
    expect(response.statusCode).toBe(400)
  })

  it('antwortet mit 400 bei kaputtem JSON', async () => {
    const response = await invoke('{kein json')
    expect(response.statusCode).toBe(400)
  })
})
