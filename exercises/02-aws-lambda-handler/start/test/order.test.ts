// TODO: Entferne .skip, sobald parseOrder und totalCents stehen.
import { describe, expect, it } from 'vitest'
import { parseOrder, totalCents } from '../src/order.ts'

const body = (value: unknown) => JSON.stringify(value)
const valid = { customerId: 'c-1', items: [{ productId: 'p-1', quantity: 2, priceCents: 1299 }] }

describe.skip('parseOrder', () => {
  it('liefert eine gültige Bestellung zurück', () => {
    expect(parseOrder(body(valid))).toEqual(valid)
  })

  it('lässt unbekannte Felder weg', () => {
    expect(parseOrder(body({ ...valid, admin: true }))).toEqual(valid)
  })

  it('lehnt eine Bestellung ohne Positionen ab', () => {
    expect(parseOrder(body({ customerId: 'c-1', items: [] }))).toBeUndefined()
  })

  it('lehnt Mengen unter 1 und Preise mit Komma ab', () => {
    expect(parseOrder(body({ customerId: 'c-1', items: [{ productId: 'p-1', quantity: 0, priceCents: 100 }] }))).toBeUndefined()
    expect(parseOrder(body({ customerId: 'c-1', items: [{ productId: 'p-1', quantity: 1, priceCents: 12.99 }] }))).toBeUndefined()
  })

  it('liefert undefined bei kaputtem oder fehlendem JSON', () => {
    expect(parseOrder('{kein json')).toBeUndefined()
    expect(parseOrder(undefined)).toBeUndefined()
    expect(parseOrder('null')).toBeUndefined()
  })
})

describe.skip('totalCents', () => {
  it('summiert Menge mal Preis in Cent', () => {
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
