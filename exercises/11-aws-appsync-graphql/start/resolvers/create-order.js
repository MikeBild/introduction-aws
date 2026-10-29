import { util } from '@aws-appsync/utils'

/**
 * TODO: Mutation.createOrder – schreib die Bestellung per ddb.put aus '@aws-appsync/utils/dynamodb':
 *       key.id aus util.autoId(), die Felder aus ctx.args.input, createdAt aus util.time.nowISO8601().
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
