// TODO: Entferne .skip, sobald deine Zugriffsmuster per Query statt Scan laufen.
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
// Kein Zugriffsmuster darf die ganze Table lesen.
afterEach(() => expect(db.commandCalls(ScanCommand)).toHaveLength(0))

const lastQuery = () => db.commandCalls(QueryCommand).at(-1)?.args[0].input

describe.skip('Zugriffsmuster', () => {
  it('1: Profil per GetItem', async () => {
    expect(await repo.getCustomerProfile('42')).toEqual({ name: 'Ada' })
    expect(db.commandCalls(GetCommand)[0]?.args[0].input.Key).toEqual({ pk: 'CUSTOMER#42', sk: 'PROFILE' })
  })

  it('2: Bestellungen eines Kunden, neueste zuerst', async () => {
    await repo.listOrdersOfCustomer('42')
    expect(lastQuery()).toMatchObject({
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :order)',
      ExpressionAttributeValues: { ':pk': 'CUSTOMER#42', ':order': 'ORDER#' },
      ScanIndexForward: false,
    })
  })

  it('3: Bestellungen im Zeitraum per BETWEEN auf dem Sort Key', async () => {
    await repo.listOrdersInRange('42', '2026-10-01', '2026-10-31')
    expect(lastQuery()?.ExpressionAttributeValues).toEqual({
      ':pk': 'CUSTOMER#42', ':from': 'ORDER#2026-10-01', ':to': 'ORDER#2026-10-31~',
    })
  })

  it('4: Bestellung per orderId über GSI1', async () => {
    expect(await repo.getOrder('A7')).toEqual({ orderId: 'A7' })
    expect(lastQuery()).toMatchObject({ IndexName: 'GSI1', ExpressionAttributeValues: { ':pk': 'ORDER#A7' } })
  })

  it('5: offene Bestellungen über GSI2, älteste zuerst', async () => {
    await repo.listOpenOrders()
    expect(lastQuery()).toMatchObject({ IndexName: 'GSI2', ScanIndexForward: true, ExpressionAttributeValues: { ':status': 'STATUS#OPEN' } })
  })
})
