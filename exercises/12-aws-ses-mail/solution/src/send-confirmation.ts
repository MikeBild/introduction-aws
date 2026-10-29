import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'

export type Order = { id: string; email: string; total: number }

const ses = new SESv2Client({})

// Text und Layout liegen im SES-Template, der Code liefert nur die Daten.
export const sendConfirmation = (order: Order) =>
  ses.send(new SendEmailCommand({
    FromEmailAddress: process.env.FROM_ADDRESS,
    ReplyToAddresses: process.env.REPLY_TO_ADDRESS ? [process.env.REPLY_TO_ADDRESS] : undefined,
    Destination: { ToAddresses: [order.email] },
    Content: {
      Template: {
        TemplateName: process.env.TEMPLATE_NAME ?? 'order-confirmed',
        TemplateData: JSON.stringify({ orderId: order.id, total: order.total.toFixed(2) }),
      },
    },
  }))

export const handler = async (order: Order) => {
  const { MessageId } = await sendConfirmation(order)
  return { orderId: order.id, messageId: MessageId }
}
