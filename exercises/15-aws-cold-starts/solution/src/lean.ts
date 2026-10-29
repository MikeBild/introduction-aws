// Nur was der Handler braucht: ein Client, gezielte Imports, Prüfung ohne Bibliothek.
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'

// Auf Modulebene: einmal pro Execution Environment, nicht pro Request.
const db = new DynamoDBClient({})

const parseInput = (event: unknown) => {
  const orderId = (event as { orderId?: unknown } | null)?.orderId
  if (typeof orderId !== 'string') throw new Error('orderId fehlt. Ruf die Function mit {"orderId":"A7"} auf.')
  return { orderId }
}

export const handler = async (event: unknown) => {
  const { orderId } = parseInput(event)
  const { Item } = await db.send(new GetItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: { pk: { S: `ORDER#${orderId}` } },
  }))
  return { orderId, found: Boolean(Item) }
}
