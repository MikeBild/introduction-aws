import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { MailStack } from '../lib/mail-stack.ts'

const template = Template.fromStack(new MailStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe('MailStack', () => {
  it('creates the template order-confirmed', () => {
    template.hasResourceProperties('AWS::SES::Template', { Template: Match.objectLike({ TemplateName: 'order-confirmed' }) })
  })

  it('stores incoming mail in S3 and then invokes Lambda', () => {
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
