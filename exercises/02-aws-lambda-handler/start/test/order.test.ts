// TODO: Entferne .skip, sobald du Order und calculateTotal umsetzt.
import { describe, expect, it } from 'vitest'
import { calculateTotal, Order } from '../src/order.ts'

describe.skip('Order', () => {
  it('akzeptiert eine gültige Bestellung', () => {
    const result = Order.safeParse({ customerId: 'c-42', items: [{ sku: 'BOOK', price: 12.5, quantity: 2 }] })
    expect(result.success).toBe(true)
  })

  it('lehnt eine Bestellung ohne Artikel ab', () => {
    expect(Order.safeParse({ customerId: 'c-42', items: [] }).success).toBe(false)
  })

  it('lehnt negative Mengen ab', () => {
    const result = Order.safeParse({ customerId: 'c-42', items: [{ sku: 'BOOK', price: 1, quantity: -1 }] })
    expect(result.success).toBe(false)
  })
})

describe.skip('calculateTotal', () => {
  it('summiert Preis mal Menge', () => {
    const total = calculateTotal({
      customerId: 'c-42',
      items: [
        { sku: 'BOOK', price: 12.5, quantity: 2 },
        { sku: 'PEN', price: 0.1, quantity: 3 },
      ],
    })
    expect(total).toEqual({ customerId: 'c-42', items: 5, total: 25.3 })
  })
})
