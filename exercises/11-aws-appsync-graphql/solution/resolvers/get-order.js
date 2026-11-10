import * as ddb from '@aws-appsync/utils/dynamodb'
import { util } from '@aws-appsync/utils'

/**
 * Query.order: reads an order directly from DynamoDB, without Lambda.
 * @param {import('@aws-appsync/utils').Context<{ id: string }>} ctx
 */
export const request = (ctx) => ddb.get({ key: { id: ctx.args.id } })

/**
 * If the order does not exist, ctx.result is empty and the query returns null.
 * @param {import('@aws-appsync/utils').Context<{ id: string }>} ctx
 */
export const response = (ctx) => {
  if (ctx.error) util.error(ctx.error.message, ctx.error.type)
  return ctx.result ?? null
}
