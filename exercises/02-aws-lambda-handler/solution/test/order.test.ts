import { describe, expect, it } from 'vitest'
import { parseOrder, totalCents } from '../src/order.ts'

const body = (value: unknown) => JSON.stringify(value)
const valid = { customerId: 'c-1', items: [{ productId: 'p-1', quantity: 2, priceCents: 1299 }] }

describe('parseOrder', () => {
  it('returns a valid order', () => {
    expect(parseOrder(body(valid))).toEqual(valid)
  })

  it('drops unknown fields', () => {
    expect(parseOrder(body({ ...valid, admin: true }))).toEqual(valid)
  })

  it('rejects an order without line items', () => {
    expect(parseOrder(body({ customerId: 'c-1', items: [] }))).toBeUndefined()
  })

  it('rejects quantities below 1 and prices with decimals', () => {
    expect(parseOrder(body({ customerId: 'c-1', items: [{ productId: 'p-1', quantity: 0, priceCents: 100 }] }))).toBeUndefined()
    expect(parseOrder(body({ customerId: 'c-1', items: [{ productId: 'p-1', quantity: 1, priceCents: 12.99 }] }))).toBeUndefined()
  })

  it('returns undefined for broken or missing JSON', () => {
    expect(parseOrder('{kein json')).toBeUndefined()
    expect(parseOrder(undefined)).toBeUndefined()
    expect(parseOrder('null')).toBeUndefined()
  })
})

describe('totalCents', () => {
  it('sums quantity times price in cents', () => {
    const order = {
      customerId: 'c-1',
      items: [
        { productId: 'p-1', quantity: 2, priceCents: 1299 },
        { productId: 'p-2', quantity: 3, priceCents: 450 },
      ],
    }
    expect(totalCents(order)).toBe(3948)
  })
})
