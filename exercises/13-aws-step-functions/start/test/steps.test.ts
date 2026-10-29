import { describe, expect, it } from 'vitest'
import { cancelOrder, chargePayment, checkStock, PaymentDeclined, PaymentProviderTimeout, reorder } from '../src/steps.ts'

const order = { orderId: 'A7', amount: 42, items: [{ sku: 'BOOK', quantity: 1 }] }

describe('Schritte', () => {
  it('bezahlt eine normale Bestellung', async () => {
    expect(await chargePayment(order)).toEqual({ paymentId: 'PAY-A7' })
  })

  it('meldet Timeouts als PaymentProviderTimeout (Retry)', async () => {
    await expect(chargePayment({ ...order, simulate: 'timeout' })).rejects.toBeInstanceOf(PaymentProviderTimeout)
    await expect(chargePayment({ ...order, simulate: 'timeout' })).rejects.toHaveProperty('name', 'PaymentProviderTimeout')
  })

  it('meldet Ablehnungen als PaymentDeclined (Catch)', async () => {
    await expect(chargePayment({ ...order, amount: 5000 })).rejects.toBeInstanceOf(PaymentDeclined)
  })

  it('prüft das Lager und bestellt fehlende Artikel nach', async () => {
    const items = [{ sku: 'BOOK', quantity: 1 }, { sku: 'OUT_OF_STOCK-MUG', quantity: 1 }]
    expect(await checkStock({ items })).toEqual({ available: false })
    expect(await reorder({ items })).toEqual({ reordered: ['OUT_OF_STOCK-MUG'] })
  })

  it('storniert', async () => {
    expect(await cancelOrder({ orderId: 'A7' })).toEqual({ orderId: 'A7', status: 'CANCELLED' })
  })
})
