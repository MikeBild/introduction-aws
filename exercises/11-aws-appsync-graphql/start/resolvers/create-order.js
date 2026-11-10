import { util } from '@aws-appsync/utils'

/**
 * TODO: Mutation.createOrder – write the order with ddb.put from '@aws-appsync/utils/dynamodb':
 *       key.id from util.autoId(), the fields from ctx.args.input, createdAt from util.time.nowISO8601().
 * @param {import('@aws-appsync/utils').Context} _ctx
 * @returns {any}
 */
export const request = (_ctx) => {
  util.error('TODO: createOrder implementieren')
}

/**
 * @param {import('@aws-appsync/utils').Context} ctx
 */
export const response = (ctx) => {
  if (ctx.error) util.error(ctx.error.message, ctx.error.type)
  return ctx.result
}
