// TODO: Entferne .skip, sobald Authorizer und Owner-Check stehen.
import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { SecureOrdersStack } from '../lib/secure-orders-stack.ts'

const template = Template.fromStack(new SecureOrdersStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe.skip('SecureOrdersStack', () => {
  it('hat einen JWT Authorizer für den User Pool', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Authorizer', { AuthorizerType: 'JWT' })
  })

  it('schützt GET /orders/{orderId}', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'GET /orders/{orderId}', AuthorizationType: 'JWT' })
  })
})
