import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'

export type Order = { id: string; email: string; total: number }

const ses = new SESv2Client({})

// Starting point: subject and text are in the code.
// TODO: Switch to Content.Template with TemplateName 'order-confirmed' and
//       TemplateData { orderId, total }, set ReplyTo to REPLY_TO_ADDRESS.
export const sendConfirmation = (order: Order) =>
  ses.send(new SendEmailCommand({
    FromEmailAddress: process.env.FROM_ADDRESS,
    Destination: { ToAddresses: [order.email] },
    Content: {
      Simple: {
        Subject: { Data: `Bestellung ${order.id} bestätigt` },
        Body: { Text: { Data: `Danke für deine Bestellung ${order.id}.` } },
      },
    },
  }))

export const handler = async (order: Order) => {
  const { MessageId } = await sendConfirmation(order)
  return { orderId: order.id, messageId: MessageId }
}
