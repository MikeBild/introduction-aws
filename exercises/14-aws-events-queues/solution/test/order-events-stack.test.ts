import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { OrderEventsStack } from '../lib/order-events-stack.ts'

const template = Template.fromStack(new OrderEventsStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe('OrderEventsStack', () => {
  it('leitet OrderPlaced per Rule in die Queue', () => {
    template.hasResourceProperties('AWS::Events::Rule', {
      EventPattern: { source: ['orders'], 'detail-type': ['OrderPlaced'] },
      Targets: [Match.objectLike({ Arn: Match.anyValue() })],
    })
  })

  it('hat eine Dead Letter Queue nach drei Fehlversuchen', () => {
    template.hasResourceProperties('AWS::SQS::Queue', {
      RedrivePolicy: { deadLetterTargetArn: Match.anyValue(), maxReceiveCount: 3 },
    })
  })

  it('nutzt Partial Batch Response', () => {
    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FunctionResponseTypes: ['ReportBatchItemFailures'],
    })
  })
})
