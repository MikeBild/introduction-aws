// TODO: Entferne .skip, sobald der jeweilige Teil steht.
import { describe, expect, it } from 'vitest'
import { parseOrder, placeOrder, totalCents } from '../src/order.ts'

const input = { customerId: 'c-1', items: [{ productId: 'p-1', quantity: 2, priceCents: 1299 }] }

describe.skip('parseOrder', () => {
  it('liefert eine gültige Bestellung', () => {
    expect(parseOrder(JSON.stringify(input))).toEqual(input)
  })

  it('liefert undefined bei kaputtem JSON oder ohne Positionen', () => {
    expect(parseOrder('{kein json')).toBeUndefined()
    expect(parseOrder(JSON.stringify({ customerId: 'c-1', items: [] }))).toBeUndefined()
  })
})

describe.skip('placeOrder', () => {
  it('legt eine Bestellung im Status placed mit Summe in Cent an', () => {
    const order = placeOrder(input, { orderId: 'A7', now: new Date('2026-10-29T10:00:00Z'), apiKey: 'test-key' })
    expect(order).toEqual({ ...input, orderId: 'A7', status: 'placed', totalCents: 2598, createdAt: '2026-10-29T10:00:00.000Z' })
    expect(totalCents(order)).toBe(2598)
  })

  it('wirft ohne API Key', () => {
    expect(() => placeOrder(input, { orderId: 'A7', now: new Date(), apiKey: '' })).toThrow('API Key')
  })
})
