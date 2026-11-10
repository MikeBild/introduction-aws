import { describe, expect, it } from 'vitest'
import { parseOrder, placeOrder, totalCents } from '../src/order.ts'

const input = { customerId: 'c-1', items: [{ productId: 'p-1', quantity: 2, priceCents: 1299 }] }

describe('parseOrder', () => {
  it('returns a valid order', () => {
    expect(parseOrder(JSON.stringify(input))).toEqual(input)
  })

  it('returns undefined for broken JSON or without line items', () => {
    expect(parseOrder('{kein json')).toBeUndefined()
    expect(parseOrder(JSON.stringify({ customerId: 'c-1', items: [] }))).toBeUndefined()
  })
})

describe('placeOrder', () => {
  it('creates an order in status placed with the total in cents', () => {
    const order = placeOrder(input, { orderId: 'A7', now: new Date('2026-10-29T10:00:00Z'), apiKey: 'test-key' })
    expect(order).toEqual({ ...input, orderId: 'A7', status: 'placed', totalCents: 2598, createdAt: '2026-10-29T10:00:00.000Z' })
    expect(totalCents(order)).toBe(2598)
  })

  it('throws without an API key', () => {
    expect(() => placeOrder(input, { orderId: 'A7', now: new Date(), apiKey: '' })).toThrow('API Key')
  })
})
