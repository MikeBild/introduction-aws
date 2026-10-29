import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { OrdersGraphqlStack } from '../lib/orders-graphql-stack.ts'

const template = Template.fromStack(new OrdersGraphqlStack(new App(), 'Test'))

describe('OrdersGraphqlStack', () => {
  it('nutzt den User Pool als Standard-Autorisierung', () => {
    template.hasResourceProperties('AWS::AppSync::GraphQLApi', { AuthenticationType: 'AMAZON_COGNITO_USER_POOLS' })
  })

  it('hat JavaScript-Resolver für order und createOrder', () => {
    for (const [TypeName, FieldName] of [['Query', 'order'], ['Mutation', 'createOrder']]) {
      template.hasResourceProperties('AWS::AppSync::Resolver', {
        TypeName, FieldName, Runtime: { Name: 'APPSYNC_JS', RuntimeVersion: '1.0.0' },
      })
    }
  })

  it('verbindet die Subscription mit createOrder', () => {
    const schema = Object.values(template.findResources('AWS::AppSync::GraphQLSchema'))[0]?.Properties.Definition
    expect(schema).toContain('@aws_subscribe(mutations: ["createOrder"])')
  })
})
