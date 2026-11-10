// TODO: Remove .skip once your access patterns run via Query instead of Scan.
import { DynamoDBDocumentClient, GetCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as repo from '../src/orders-repository.ts'

const db = mockClient(DynamoDBDocumentClient)
beforeEach(() => {
  db.reset()
  db.on(QueryCommand).resolves({ Items: [{ orderId: 'A7' }] })
  db.on(GetCommand).resolves({ Item: { name: 'Ada' } })
})
// No access pattern may read the whole table.
afterEach(() => expect(db.commandCalls(ScanCommand)).toHaveLength(0))

const lastQuery = () => db.commandCalls(QueryCommand).at(-1)?.args[0].input

describe.skip('Zugriffsmuster', () => {
  it('1: profile via GetItem', async () => {
    expect(await repo.getCustomerProfile('42')).toEqual({ name: 'Ada' })
    expect(db.commandCalls(GetCommand)[0]?.args[0].input.Key).toEqual({ pk: 'CUSTOMER#42', sk: 'PROFILE' })
  })

  it('2: orders of a customer, newest first', async () => {
    await repo.listOrdersOfCustomer('42')
    expect(lastQuery()).toMatchObject({
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :order)',
      ExpressionAttributeValues: { ':pk': 'CUSTOMER#42', ':order': 'ORDER#' },
      ScanIndexForward: false,
    })
  })

  it('3: orders in a date range via BETWEEN on the sort key', async () => {
    await repo.listOrdersInRange('42', '2026-10-01', '2026-10-31')
    expect(lastQuery()?.ExpressionAttributeValues).toEqual({
      ':pk': 'CUSTOMER#42', ':from': 'ORDER#2026-10-01', ':to': 'ORDER#2026-10-31~',
    })
  })

  it('4: order by orderId via GSI1', async () => {
    expect(await repo.getOrder('A7')).toEqual({ orderId: 'A7' })
    expect(lastQuery()).toMatchObject({ IndexName: 'GSI1', ExpressionAttributeValues: { ':pk': 'ORDER#A7' } })
  })

  it('5: open orders via GSI2, oldest first', async () => {
    await repo.listOpenOrders()
    expect(lastQuery()).toMatchObject({ IndexName: 'GSI2', ScanIndexForward: true, ExpressionAttributeValues: { ':status': 'STATUS#OPEN' } })
  })
})
