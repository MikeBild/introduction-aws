import type { Context } from '@aws-appsync/utils'
import { describe, expect, it, vi } from 'vitest'

// The AppSync runtime only exists in AWS. For unit tests we replace the helpers.
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

describe('Query.order', () => {
  it('reads via GetItem', () => {
    expect(getOrder.request(ctx({ args: { id: 'A7' } }))).toEqual({ operation: 'GetItem', key: { id: 'A7' } })
  })

  it('returns the order', () => {
    const order = { id: 'A7', customerId: 'c-1' }
    expect(getOrder.response(ctx({ args: { id: 'A7' }, result: order }))).toEqual(order)
  })

  it('returns null when the order does not exist', () => {
    expect(getOrder.response(ctx({ args: { id: 'X' } }))).toBeNull()
  })
})

describe('Mutation.createOrder', () => {
  it('writes the order with an ID and timestamp from the resolver', () => {
    const input = { customerId: 'c-1', items: [{ productId: 'p-1', quantity: 2, priceCents: 1299 }] }
    expect(createOrder.request(ctx({ args: { input } }))).toEqual({
      operation: 'PutItem',
      key: { id: 'id-1' },
      item: { ...input, createdAt: '2026-10-29T10:00:00Z' },
    })
  })

  it('passes data source errors through', () => {
    expect(() => createOrder.response(ctx({ error: { message: 'kaputt', type: 'X' } }))).toThrow('kaputt')
  })
})
