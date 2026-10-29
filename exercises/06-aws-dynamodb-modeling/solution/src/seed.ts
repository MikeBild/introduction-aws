// Testdaten für die deployte Table:
//   TABLE_NAME=<Wert aus dem Output> node src/seed.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BatchWriteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { customerPk, orderGsi1pk, orderSk, PROFILE_SK, statusGsi2pk } from './keys.ts'

const order = (customerId: string, orderId: string, createdAt: string, status: 'OPEN' | 'SHIPPED') => ({
  pk: customerPk(customerId),
  sk: orderSk(createdAt.slice(0, 10), orderId),
  gsi1pk: orderGsi1pk(orderId),
  ...(status === 'OPEN' ? { gsi2pk: statusGsi2pk('OPEN'), gsi2sk: createdAt } : {}),
  orderId, customerId, createdAt, status,
})

export const items = [
  { pk: customerPk('42'), sk: PROFILE_SK, name: 'Ada', email: 'ada@example.com' },
  order('42', 'A7', '2026-10-17T09:30:00Z', 'OPEN'),
  order('42', 'A3', '2026-10-01T14:00:00Z', 'SHIPPED'),
  order('42', 'A1', '2026-09-12T08:15:00Z', 'SHIPPED'),
  { pk: customerPk('7'), sk: PROFILE_SK, name: 'Grace', email: 'grace@example.com' },
  order('7', 'B2', '2026-10-20T11:00:00Z', 'OPEN'),
]

if (import.meta.main) {
  const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  await db.send(new BatchWriteCommand({
    RequestItems: { [process.env.TABLE_NAME!]: items.map((Item) => ({ PutRequest: { Item } })) },
  }))
  console.log(`${items.length} Items geschrieben`)
}
