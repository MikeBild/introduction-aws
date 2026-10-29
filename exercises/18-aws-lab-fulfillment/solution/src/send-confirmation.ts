import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'
import type { OrderPlaced } from './events.ts'

const ses = new SESv2Client({})

// Cent nur für die Anzeige in Euro umrechnen.
export const formatEuro = (cents: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100)

// In der SES-Sandbox geht Mail nur an verifizierte Adressen. Darum steht der
// Empfänger in der Konfiguration, nicht in der Bestellung.
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
