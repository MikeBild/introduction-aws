// TODO: Remove .skip once handler and stack use the Parameter Store.
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import { clearCaches } from '@aws-lambda-powertools/parameters'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handler } from '../src/charge-payment.ts'

vi.stubEnv('API_KEY_PARAMETER', '/orders/payments/api-key')
vi.stubEnv('MAX_ITEMS_PARAMETER', '/orders/max-items')

const ssm = mockClient(SSMClient)
beforeEach(() => {
  ssm.reset()
  clearCaches()
  ssm.on(GetParameterCommand, { Name: '/orders/payments/api-key' }).resolves({ Parameter: { Value: 'test-key' } })
  ssm.on(GetParameterCommand, { Name: '/orders/max-items' }).resolves({ Parameter: { Value: '3' } })
})

describe.skip('charge-payment', () => {
  it('loads the API key decrypted from SSM', async () => {
    expect(await handler({ orderId: 'A7', amount: 10, items: 1 })).toEqual({ orderId: 'A7', status: 'CHARGED' })
    const apiKeyCall = ssm.commandCalls(GetParameterCommand).find((c) => c.args[0].input.Name === '/orders/payments/api-key')
    expect(apiKeyCall?.args[0].input.WithDecryption).toBe(true)
  })

  it('caches the parameters between invocations', async () => {
    await handler({ orderId: 'A7', amount: 10, items: 1 })
    await handler({ orderId: 'A8', amount: 10, items: 1 })
    expect(ssm.commandCalls(GetParameterCommand)).toHaveLength(2)
  })

  it('applies the limit from the Parameter Store', async () => {
    expect(await handler({ orderId: 'A9', amount: 10, items: 5 })).toMatchObject({ status: 'REJECTED' })
  })
})
