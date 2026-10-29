// TODO: Entferne .skip, sobald der jeweilige Teil steht.
import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { OrdersStack } from '../lib/orders-stack.ts'

const template = Template.fromStack(new OrdersStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe.skip('OrdersStack', () => {
  it('hat POST und GET auf /orders', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'POST /orders' })
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'GET /orders' })
  })

  it('nutzt Node.js 24 auf ARM', () => {
    template.allResourcesProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs24.x',
      Architectures: ['arm64'],
    })
  })

  it('erlaubt nur PlaceOrder, den API Key zu lesen', () => {
    template.resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({ Action: Match.arrayWith(['ssm:GetParameter']) })]),
      },
    }, 1)
  })

  it('gibt die URL der API aus', () => {
    template.hasOutput('ApiUrl', {})
  })
})
