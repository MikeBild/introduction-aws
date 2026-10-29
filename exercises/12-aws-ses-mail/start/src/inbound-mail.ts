import type { SESHandler } from 'aws-lambda'
import { parseMail } from './parse-mail.ts'

// TODO: Für jeden Record die Rohmail aus S3 laden:
//       Bucket aus BUCKET_NAME, Key = OBJECT_PREFIX + record.ses.mail.messageId.
//       Das SES-Event selbst enthält keinen Mail-Body.
export const handler: SESHandler = async (event) => {
  for (const record of event.Records) {
    const mail = parseMail('')
    console.log(JSON.stringify({ message: 'Antwort eingegangen', messageId: record.ses.mail.messageId, orderId: mail.orderId }))
  }
}
