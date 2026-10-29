import * as ddb from '@aws-appsync/utils/dynamodb'
import { util } from '@aws-appsync/utils'

/**
 * Query.order: liest eine Bestellung direkt aus DynamoDB, ohne Lambda.
 * @param {import('@aws-appsync/utils').Context<{ id: string }>} ctx
 */
export const request = (ctx) => ddb.get({ key: { id: ctx.args.id } })

/**
 * Gibt es die Bestellung nicht, ist ctx.result leer und die Query liefert null.
 * @param {import('@aws-appsync/utils').Context<{ id: string }>} ctx
 */
export const response = (ctx) => {
  if (ctx.error) util.error(ctx.error.message, ctx.error.type)
  return ctx.result ?? null
}
