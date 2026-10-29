// TODO: Entferne .skip, sobald Mutation, Subscription und createOrder-Resolver stehen.
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

const ctx = (props: object) => props as unknown as Context<any>

describe.skip('Query.order', () => {
  it('liest per GetItem', () => {
    expect(getOrder.request(ctx({ args: { id: 'A7' } }))).toEqual({ operation: 'GetItem', key: { id: 'A7' } })
  })

  it('liefert die Bestellung', () => {
    const order = { id: 'A7', customerId: 'c-1' }
    expect(getOrder.response(ctx({ args: { id: 'A7' }, result: order }))).toEqual(order)
  })

  it('liefert null, wenn es die Bestellung nicht gibt', () => {
    expect(getOrder.response(ctx({ args: { id: 'X' } }))).toBeNull()
  })
})

describe.skip('Mutation.createOrder', () => {
  it('schreibt die Bestellung mit ID und Zeitstempel aus dem Resolver', () => {
    const input = { customerId: 'c-1', items: [{ productId: 'p-1', quantity: 2, priceCents: 1299 }] }
    expect(createOrder.request(ctx({ args: { input } }))).toEqual({
      operation: 'PutItem',
      key: { id: 'id-1' },
      item: { ...input, createdAt: '2026-10-29T10:00:00Z' },
    })
  })

  it('reicht Fehler der Data Source weiter', () => {
    expect(() => createOrder.response(ctx({ error: { message: 'kaputt', type: 'X' } }))).toThrow('kaputt')
  })
})
