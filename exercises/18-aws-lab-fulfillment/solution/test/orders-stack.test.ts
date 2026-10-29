import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { OrdersStack } from '../lib/orders-stack.ts'

const template = Template.fromStack(new OrdersStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))
const orderPlaced = { source: ['werkstatt.orders'], 'detail-type': ['OrderPlaced'] }

describe('OrdersStack, Teil eins', () => {
  it('hat POST und GET auf /orders', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'POST /orders' })
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'GET /orders' })
    template.hasOutput('ApiUrl', {})
  })
})

describe('OrdersStack, Teil zwei', () => {
  it('hat einen eigenen Event Bus ohne festen Namen', () => {
    template.resourceCountIs('AWS::Events::EventBus', 1)
  })

  it('leitet OrderPlaced in eine Queue mit Dead Letter Queue nach drei Versuchen', () => {
    template.resourcePropertiesCountIs('AWS::Events::Rule', { EventPattern: orderPlaced }, 2)
    template.hasResourceProperties('AWS::SQS::Queue', {
      RedrivePolicy: { deadLetterTargetArn: Match.anyValue(), maxReceiveCount: 3 },
    })
    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FunctionResponseTypes: ['ReportBatchItemFailures'],
    })
  })

  it('startet pro Bestellung die State Machine nur mit detail', () => {
    template.hasResourceProperties('AWS::Events::Rule', {
      EventPattern: orderPlaced,
      Targets: [Match.objectLike({ InputPath: '$.detail' })],
    })
  })

  it('bezahlt mit Retry, storniert im Catch und bestätigt per SES', () => {
    const machine = Object.values(template.findResources('AWS::StepFunctions::StateMachine'))[0]
    const definition = JSON.stringify(machine?.Properties.DefinitionString)
    for (const text of ['PaymentProviderTimeout', 'PaymentDeclined', 'Stornieren', 'Versenden', 'Bestaetigen'])
      expect(definition).toContain(text)
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: { Statement: Match.arrayWith([Match.objectLike({ Action: 'ses:SendEmail' })]) },
    })
  })

  it('legt keine SES-Identity an', () => {
    template.resourceCountIs('AWS::SES::EmailIdentity', 0)
  })
})
