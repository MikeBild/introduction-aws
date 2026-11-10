import type { OrderPlaced } from './events.ts'

// Convert cents to euros for display only.
export const formatEuro = (cents: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100)

// TODO (exercise 12): SendEmailCommand from '@aws-sdk/client-sesv2' from FROM_ADDRESS to TO_ADDRESS,
//      subject 'Bestellung <orderId> bestätigt', text with formatEuro(totalCents) and trackingId.
//      In the SES sandbox, mail only goes to verified addresses.
export const handler = async (_order: OrderPlaced & { trackingId?: string }): Promise<{ messageId?: string }> => {
  throw new Error('TODO: Bestätigung per SES schicken')
}
