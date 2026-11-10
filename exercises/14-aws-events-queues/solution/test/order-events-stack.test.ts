import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { OrderEventsStack } from '../lib/order-events-stack.ts'

const template = Template.fromStack(new OrderEventsStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe('OrderEventsStack', () => {
  it('routes OrderPlaced to the queue via a rule', () => {
    template.hasResourceProperties('AWS::Events::Rule', {
      EventPattern: { source: ['orders'], 'detail-type': ['OrderPlaced'] },
      Targets: [Match.objectLike({ Arn: Match.anyValue() })],
    })
  })

  it('has a dead letter queue after three failed attempts', () => {
    template.hasResourceProperties('AWS::SQS::Queue', {
      RedrivePolicy: { deadLetterTargetArn: Match.anyValue(), maxReceiveCount: 3 },
    })
  })

  it('has a table for reservations with orderId as key', () => {
    template.hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [{ AttributeName: 'orderId', KeyType: 'HASH' }],
    })
  })

  it('nutzt Partial Batch Response', () => {
    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FunctionResponseTypes: ['ReportBatchItemFailures'],
    })
  })
})
