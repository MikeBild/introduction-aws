import type { Context } from '@aws-appsync/utils'
import { describe, expect, it, vi } from 'vitest'

// Die AppSync-Runtime gibt es nur in AWS. Für Unit Tests ersetzen wir die Helfer.
vi.mock('@aws-appsync/utils', () => ({
  util: {
    autoId: () => 'id-1',
    time: { nowISO8601: () => '2026-10-29T10:00:00Z' },
    error: (message: string) => {
      throw new Error(message)
    },
  },
}))
vi.mock('@aws-appsync/utils/dynamodb', () => ({
  get: (props: object) => ({ operation: 'GetItem', ...props }),
  put: (props: object) => ({ operation: 'PutItem', ...props }),
}))

const getOrder = await import('../resolvers/get-order.js')
const createOrder = await import('../resolvers/create-order.js')

const ctx = (props: object) => ({ identity: { sub: 'ada' }, ...props }) as unknown as Context<any>

describe('Query.order', () => {
  it('liest per GetItem', () => {
    expect(getOrder.request(ctx({ args: { id: 'A7' } }))).toEqual({ operation: 'GetItem', key: { id: 'A7' } })
  })

  it('liefert die eigene Bestellung', () => {
    const order = { id: 'A7', ownerId: 'ada' }
    expect(getOrder.response(ctx({ args: { id: 'A7' }, result: order }))).toEqual(order)
  })

  it('liefert null für fremde Bestellungen', () => {
    expect(getOrder.response(ctx({ args: { id: 'A7' }, result: { id: 'A7', ownerId: 'grace' } }))).toBeNull()
  })
})

describe('Mutation.createOrder', () => {
  it('schreibt die Bestellung mit ownerId aus der Identity', () => {
    const items = [{ sku: 'BOOK', quantity: 1 }]
    expect(createOrder.request(ctx({ args: { input: { items } } }))).toEqual({
      operation: 'PutItem',
      key: { id: 'id-1' },
      item: { items, ownerId: 'ada', createdAt: '2026-10-29T10:00:00Z' },
    })
  })

  it('reicht Fehler der Data Source weiter', () => {
    expect(() => createOrder.response(ctx({ error: { message: 'kaputt', type: 'X' } }))).toThrow('kaputt')
  })
})
