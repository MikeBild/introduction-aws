// TODO: Entferne .skip, sobald Template, Parser und Receipt Rule stehen.
import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { MailStack } from '../lib/mail-stack.ts'

const template = Template.fromStack(new MailStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe.skip('MailStack', () => {
  it('legt das Template order-confirmed an', () => {
    template.hasResourceProperties('AWS::SES::Template', { Template: Match.objectLike({ TemplateName: 'order-confirmed' }) })
  })

  it('speichert eingehende Mails in S3 und ruft danach Lambda auf', () => {
    template.hasResourceProperties('AWS::SES::ReceiptRule', {
      Rule: Match.objectLike({
        Recipients: ['reply@example.com'],
        Actions: [
          Match.objectLike({ S3Action: Match.objectLike({ ObjectKeyPrefix: 'inbound/' }) }),
          Match.objectLike({ LambdaAction: Match.objectLike({ InvocationType: 'Event' }) }),
        ],
      }),
    })
  })
})
