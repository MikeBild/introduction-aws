import * as ddb from '@aws-appsync/utils/dynamodb'
import { util } from '@aws-appsync/utils'

/** @typedef {{ id: string, ownerId: string, items: { sku: string, quantity: number }[], createdAt: string }} Order */

/**
 * Mutation.createOrder: schreibt die Bestellung mit der sub des Aufrufers als ownerId.
 * @param {import('@aws-appsync/utils').Context<{ input: { items: { sku: string, quantity: number }[] } }>} ctx
 */
export const request = (ctx) => {
  const identity = /** @type {import('@aws-appsync/utils').AppSyncIdentityCognito} */ (ctx.identity)
  /** @type {ddb.PutInput<Order>} */
  const put = {
    key: { id: util.autoId() },
    item: { ...ctx.args.input, ownerId: identity.sub, createdAt: util.time.nowISO8601() },
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
