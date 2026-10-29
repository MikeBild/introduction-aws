import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { OrdersApiStack } from '../lib/orders-api-stack.ts'

const template = Template.fromStack(new OrdersApiStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe('OrdersApiStack', () => {
  it('legt eine HTTP-API an', () => {
    template.resourceCountIs('AWS::ApiGatewayV2::Api', 1)
    template.hasResourceProperties('AWS::ApiGatewayV2::Api', { ProtocolType: 'HTTP' })
  })

  it('hat die Routes GET /orders und POST /orders', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'GET /orders' })
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', { RouteKey: 'POST /orders' })
  })
})
