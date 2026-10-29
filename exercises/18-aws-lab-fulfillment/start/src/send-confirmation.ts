import type { OrderPlaced } from './events.ts'

// Cent nur für die Anzeige in Euro umrechnen.
export const formatEuro = (cents: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100)

// TODO (Übung 12): SendEmailCommand aus '@aws-sdk/client-sesv2' von FROM_ADDRESS an TO_ADDRESS,
//      Betreff 'Bestellung <orderId> bestätigt', Text mit formatEuro(totalCents) und trackingId.
//      In der SES-Sandbox geht Mail nur an verifizierte Adressen.
export const handler = async (_order: OrderPlaced & { trackingId?: string }): Promise<{ messageId?: string }> => {
  throw new Error('TODO: Bestätigung per SES schicken')
}
