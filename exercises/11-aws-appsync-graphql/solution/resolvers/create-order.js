import * as ddb from '@aws-appsync/utils/dynamodb'
import { util } from '@aws-appsync/utils'

/** @typedef {{ productId: string, quantity: number, priceCents: number }} OrderItem */
/** @typedef {{ customerId: string, items: OrderItem[] }} CreateOrderInput */
/** @typedef {CreateOrderInput & { id: string, createdAt: string }} Order */

/**
 * Mutation.createOrder: ID und Zeitstempel erzeugt der Resolver, nie der Client.
 * @param {import('@aws-appsync/utils').Context<{ input: CreateOrderInput }>} ctx
 */
export const request = (ctx) => {
  /** @type {ddb.PutInput<Order>} */
  const put = {
    key: { id: util.autoId() },
    item: { ...ctx.args.input, createdAt: util.time.nowISO8601() },
  }
  return ddb.put(put)
}

/**
 * Das Ergebnis der Mutation löst auch onOrderCreated aus.
 * @param {import('@aws-appsync/utils').Context} ctx
 */
export const response = (ctx) => {
  if (ctx.error) util.error(ctx.error.message, ctx.error.type)
  return ctx.result
}
