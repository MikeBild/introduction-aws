import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { OrdersStack } from '../lib/orders-stack.ts'

const template = Template.fromStack(new OrdersStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))
const orderPlaced = { source: ['werkstatt.orders'], 'detail-type': ['OrderPlaced'] }

describe('OrdersStack, part one', () => {
  it('has POST and GET on /orders', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'POST /orders' })
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'GET /orders' })
    template.hasOutput('ApiUrl', {})
  })
})

describe('OrdersStack, part two', () => {
  it('has its own event bus without a fixed name', () => {
    template.resourceCountIs('AWS::Events::EventBus', 1)
  })

  it('routes OrderPlaced to a queue with a dead letter queue after three attempts', () => {
    template.resourcePropertiesCountIs('AWS::Events::Rule', { EventPattern: orderPlaced }, 2)
    template.hasResourceProperties('AWS::SQS::Queue', {
      RedrivePolicy: { deadLetterTargetArn: Match.anyValue(), maxReceiveCount: 3 },
    })
    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FunctionResponseTypes: ['ReportBatchItemFailures'],
    })
  })

  it('starts the state machine per order with detail only', () => {
    template.hasResourceProperties('AWS::Events::Rule', {
      EventPattern: orderPlaced,
      Targets: [Match.objectLike({ InputPath: '$.detail' })],
    })
  })

  it('charges with retry, cancels in the catch and confirms via SES', () => {
    const machine = Object.values(template.findResources('AWS::StepFunctions::StateMachine'))[0]
    const definition = JSON.stringify(machine?.Properties.DefinitionString)
    for (const text of ['PaymentProviderTimeout', 'PaymentDeclined', 'Stornieren', 'Versenden', 'Bestaetigen'])
      expect(definition).toContain(text)
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: { Statement: Match.arrayWith([Match.objectLike({ Action: 'ses:SendEmail' })]) },
    })
  })

  it('creates no SES identity', () => {
    template.resourceCountIs('AWS::SES::EmailIdentity', 0)
  })
})
