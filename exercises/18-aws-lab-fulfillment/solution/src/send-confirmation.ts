import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'
import type { OrderPlaced } from './events.ts'

const ses = new SESv2Client({})

// Convert cents to euros for display only.
export const formatEuro = (cents: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100)

// In the SES sandbox, mail only goes to verified addresses. That is why the
// recipient is in the configuration, not in the order.
export const handler = async (order: OrderPlaced & { trackingId?: string }) => {
  const { MessageId } = await ses.send(new SendEmailCommand({
    FromEmailAddress: process.env.FROM_ADDRESS,
    Destination: { ToAddresses: [process.env.TO_ADDRESS!] },
    Content: {
      Simple: {
        Subject: { Data: `Bestellung ${order.orderId} bestätigt` },
        Body: { Text: { Data: `Danke für deine Bestellung über ${formatEuro(order.totalCents)}. Sendung: ${order.trackingId ?? 'folgt'}.` } },
      },
    },
  }))
  return { messageId: MessageId }
}
