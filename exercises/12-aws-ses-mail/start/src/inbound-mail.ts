import type { SESHandler } from 'aws-lambda'
import { parseMail } from './parse-mail.ts'

// TODO: Load the raw mail from S3 for each record:
//       bucket from BUCKET_NAME, key = OBJECT_PREFIX + record.ses.mail.messageId.
//       The SES event itself contains no mail body.
export const handler: SESHandler = async (event) => {
  for (const record of event.Records) {
    const mail = parseMail('')
    console.log(JSON.stringify({ message: 'Antwort eingegangen', messageId: record.ses.mail.messageId, orderId: mail.orderId }))
  }
}
