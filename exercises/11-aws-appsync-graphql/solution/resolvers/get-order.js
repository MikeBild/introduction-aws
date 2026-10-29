import * as ddb from '@aws-appsync/utils/dynamodb'
import { util } from '@aws-appsync/utils'

/**
 * Query.order: liest eine Bestellung direkt aus DynamoDB, ohne Lambda.
 * @param {import('@aws-appsync/utils').Context<{ id: string }>} ctx
 */
export const request = (ctx) => ddb.get({ key: { id: ctx.args.id } })

/**
 * Fremde Bestellungen sehen aus wie nicht vorhandene.
 * @param {import('@aws-appsync/utils').Context<{ id: string }>} ctx
 */
export const response = (ctx) => {
  if (ctx.error) util.error(ctx.error.message, ctx.error.type)
  const identity = /** @type {import('@aws-appsync/utils').AppSyncIdentityCognito} */ (ctx.identity)
  if (!ctx.result || ctx.result.ownerId !== identity.sub) return null
  return ctx.result
}
