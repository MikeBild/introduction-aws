import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { OrdersStack } from '../lib/orders-stack.ts'

const template = Template.fromStack(new OrdersStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe('OrdersStack', () => {
  it('has POST and GET on /orders', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'POST /orders' })
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'GET /orders' })
  })

  it('uses Node.js 24 on ARM', () => {
    template.allResourcesProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs24.x',
      Architectures: ['arm64'],
    })
  })

  it('allows only PlaceOrder to read the API key', () => {
    template.resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({ Action: Match.arrayWith(['ssm:GetParameter']) })]),
      },
    }, 1)
  })

  it('outputs the URL of the API', () => {
    template.hasOutput('ApiUrl', {})
  })
})
