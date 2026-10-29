// Alle Entities liegen in einer Table. `type` macht Items unterscheidbar.
export type Customer = { type: 'Customer'; pk: `CUSTOMER#${string}`; sk: 'PROFILE'; name: string }
export type Order = { type: 'Order'; pk: `CUSTOMER#${string}`; sk: `ORDER#${string}`; orderId: string; status: string }
export type OrderLine = { type: 'OrderLine'; pk: `ORDER#${string}`; sk: `PRODUCT#${string}`; quantity: number; price: number }
export type Product = { type: 'Product'; pk: `PRODUCT#${string}`; sk: `PRODUCT#${string}`; title: string }
export type ShopItem = Customer | Order | OrderLine | Product

export const customer = (id: string, name: string): Customer =>
  ({ type: 'Customer', pk: `CUSTOMER#${id}`, sk: 'PROFILE', name })
export const order = (customerId: string, orderId: string, date: string, status = 'OPEN'): Order =>
  ({ type: 'Order', pk: `CUSTOMER#${customerId}`, sk: `ORDER#${date}#${orderId}`, orderId, status })
export const orderLine = (orderId: string, productId: string, quantity: number, price: number): OrderLine =>
  ({ type: 'OrderLine', pk: `ORDER#${orderId}`, sk: `PRODUCT#${productId}`, quantity, price })
export const product = (id: string, title: string): Product =>
  ({ type: 'Product', pk: `PRODUCT#${id}`, sk: `PRODUCT#${id}`, title })

export const seedItems: ShopItem[] = [
  customer('42', 'Ada'),
  order('42', 'A7', '2026-10-17'),
  order('42', 'A3', '2026-10-01', 'SHIPPED'),
  orderLine('A7', '9', 1, 39.9),
  orderLine('A7', '12', 2, 4.5),
  orderLine('A3', '9', 1, 39.9),
  customer('7', 'Grace'),
  order('7', 'B2', '2026-10-20'),
  orderLine('B2', '9', 3, 39.9),
  product('9', 'Serverless-Handbuch'),
  product('12', 'Kaffeebecher'),
]
