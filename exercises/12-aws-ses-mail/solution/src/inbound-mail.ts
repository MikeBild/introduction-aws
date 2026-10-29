import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { SESHandler } from 'aws-lambda'
import { parseMail } from './parse-mail.ts'

const s3 = new S3Client({})

// Die Receipt Rule legt die Rohmail zuerst in S3 ab (Key: Prefix + Message-ID)
// und ruft danach diese Function auf. Das Event enthält nur Metadaten, keinen Body.
export const handler: SESHandler = async (event) => {
  for (const record of event.Records) {
    const { messageId } = record.ses.mail
    const object = await s3.send(new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${process.env.OBJECT_PREFIX ?? ''}${messageId}`,
    }))
    const mail = parseMail(await object.Body!.transformToString())
    console.log(JSON.stringify({ message: 'Antwort eingegangen', messageId, from: mail.from, orderId: mail.orderId }))
  }
}
