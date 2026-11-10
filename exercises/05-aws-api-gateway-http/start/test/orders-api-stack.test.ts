// TODO: Remove .skip once the HTTP API and both routes are in place.
import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { OrdersApiStack } from '../lib/orders-api-stack.ts'

const template = Template.fromStack(new OrdersApiStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe.skip('OrdersApiStack', () => {
  it('creates an HTTP API', () => {
    template.resourceCountIs('AWS::ApiGatewayV2::Api', 1)
    template.hasResourceProperties('AWS::ApiGatewayV2::Api', { ProtocolType: 'HTTP' })
  })

  it('has the routes GET /orders and POST /orders', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'GET /orders' })
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'POST /orders' })
  })
})
