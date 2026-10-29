// Ausgangslage: lädt beim Init alles, was irgendwann gebraucht werden könnte.
import * as dynamodb from '@aws-sdk/client-dynamodb'
import * as s3 from '@aws-sdk/client-s3'
import * as ses from '@aws-sdk/client-sesv2'
import * as ssm from '@aws-sdk/client-ssm'
import { z } from 'zod'

const clients = {
  db: new dynamodb.DynamoDBClient({}),
  s3: new s3.S3Client({}),
  ses: new ses.SESv2Client({}),
  ssm: new ssm.SSMClient({}),
}

const Input = z.object({ orderId: z.string() })

export const handler = async (event: unknown) => {
  const { orderId } = Input.parse(event)
  const { Item } = await clients.db.send(new dynamodb.GetItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: { pk: { S: `ORDER#${orderId}` } },
  }))
  return { orderId, found: Boolean(Item) }
}
