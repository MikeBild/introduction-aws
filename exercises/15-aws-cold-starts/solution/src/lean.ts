// Only what the handler needs: one client, targeted imports, validation without a library.
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'

// At module level: once per execution environment, not per request.
const db = new DynamoDBClient({})

const parseInput = (event: unknown) => {
  const orderId = (event as { orderId?: unknown } | null)?.orderId
  if (typeof orderId !== 'string') throw new Error('orderId fehlt. Ruf die Funktion mit {"orderId":"A7"} auf.')
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
