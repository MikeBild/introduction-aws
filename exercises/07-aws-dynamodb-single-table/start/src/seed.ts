// Testdaten schreiben:  TABLE_NAME=<TableName> node src/seed.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BatchWriteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { seedItems } from './items.ts'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
await db.send(new BatchWriteCommand({
  RequestItems: { [process.env.TABLE_NAME!]: seedItems.map((Item) => ({ PutRequest: { Item } })) },
}))
console.log(`${seedItems.length} Items geschrieben`)
