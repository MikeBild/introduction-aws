import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'
import type { Context, SESEvent } from 'aws-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handler as inboundMail } from '../src/inbound-mail.ts'
import { parseMail } from '../src/parse-mail.ts'
import { handler as sendConfirmation } from '../src/send-confirmation.ts'

vi.stubEnv('FROM_ADDRESS', 'shop@example.com')
vi.stubEnv('BUCKET_NAME', 'inbound-bucket')
vi.stubEnv('OBJECT_PREFIX', 'inbound/')

const ses = mockClient(SESv2Client)
const s3 = mockClient(S3Client)
beforeEach(() => {
  ses.reset()
  s3.reset()
})

const raw = [
  'From: Ada <ada@example.com>',
  'To: reply@example.com',
  'Subject: Re: Bestellung A7 bestätigt',
  '',
  'Kann ich die Lieferadresse noch ändern?',
].join('\r\n')

describe('sendConfirmation', () => {
  it('verschickt die Bestätigung per Template', async () => {
    ses.on(SendEmailCommand).resolves({ MessageId: 'm-1' })
    expect(await sendConfirmation({ id: 'A7', email: 'ada@example.com', total: 42 })).toEqual({ orderId: 'A7', messageId: 'm-1' })
    expect(ses.commandCalls(SendEmailCommand)[0]?.args[0].input).toMatchObject({
      FromEmailAddress: 'shop@example.com',
      Destination: { ToAddresses: ['ada@example.com'] },
      Content: { Template: { TemplateName: 'order-confirmed', TemplateData: '{"orderId":"A7","total":"42.00"}' } },
    })
  })
})

describe('parseMail', () => {
  it('liest Absender, Betreff, Bestellnummer und Text', () => {
    expect(parseMail(raw)).toEqual({
      from: 'Ada <ada@example.com>',
      subject: 'Re: Bestellung A7 bestätigt',
      orderId: 'A7',
      text: 'Kann ich die Lieferadresse noch ändern?',
    })
  })
})

describe('inboundMail', () => {
  it('lädt die Rohmail per Message-ID aus S3', async () => {
    s3.on(GetObjectCommand).resolves({ Body: { transformToString: async () => raw } } as never)
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const event = { Records: [{ ses: { mail: { messageId: 'msg-1' } } }] } as unknown as SESEvent
    await inboundMail(event, {} as Context, () => {})
    expect(s3.commandCalls(GetObjectCommand)[0]?.args[0].input).toEqual({ Bucket: 'inbound-bucket', Key: 'inbound/msg-1' })
    expect(log.mock.calls[0]?.[0]).toContain('"orderId":"A7"')
  })
})
