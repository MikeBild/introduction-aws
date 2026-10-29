import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { seedItems } from '../src/items.ts'
import { getCustomerWithOrders, getOrderLines, getOrdersOfProduct } from '../src/shop-repository.ts'

const db = mockClient(DynamoDBDocumentClient)
beforeEach(() => db.reset())
afterEach(() => expect(db.commandCalls(ScanCommand)).toHaveLength(0))

const lastQuery = () => db.commandCalls(QueryCommand).at(-1)?.args[0].input

describe('Single-Table', () => {
  it('lädt Kunde und Bestellungen mit einer Query', async () => {
    db.on(QueryCommand).resolves({ Items: seedItems.filter((i) => i.pk === 'CUSTOMER#42') })
    const { customer, orders } = await getCustomerWithOrders('42')
    expect(customer?.name).toBe('Ada')
    expect(orders.map((o) => o.orderId)).toEqual(['A7', 'A3'])
    expect(db.commandCalls(QueryCommand)).toHaveLength(1)
  })

  it('lädt die Positionen einer Bestellung', async () => {
    db.on(QueryCommand).resolves({ Items: seedItems.filter((i) => i.pk === 'ORDER#A7') })
    expect(await getOrderLines('A7')).toHaveLength(2)
    expect(lastQuery()?.ExpressionAttributeValues).toEqual({ ':pk': 'ORDER#A7', ':product': 'PRODUCT#' })
  })

  it('beantwortet „Bestellungen eines Produkts“ über den Inverted Index', async () => {
    db.on(QueryCommand).resolves({
      Items: seedItems.filter((i) => i.sk === 'PRODUCT#9' && i.pk.startsWith('ORDER#')),
    })
    expect(await getOrdersOfProduct('9')).toEqual([
      { orderId: 'A7', quantity: 1 },
      { orderId: 'A3', quantity: 1 },
      { orderId: 'B2', quantity: 3 },
    ])
    expect(lastQuery()).toMatchObject({
      IndexName: 'GSI1',
      KeyConditionExpression: 'sk = :product AND begins_with(pk, :order)',
    })
  })
})
