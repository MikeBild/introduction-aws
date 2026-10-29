import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { OrdersGraphqlStack } from '../lib/orders-graphql-stack.ts'

const template = Template.fromStack(new OrdersGraphqlStack(new App(), 'Test'))
const schema = (): string =>
  Object.values(template.findResources('AWS::AppSync::GraphQLSchema'))[0]?.Properties.Definition

describe('OrdersGraphqlStack', () => {
  it('nutzt API Key als Standard und IAM als zweiten Modus', () => {
    template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'API_KEY',
      AdditionalAuthenticationProviders: [Match.objectLike({ AuthenticationType: 'AWS_IAM' })],
    })
    template.resourceCountIs('AWS::AppSync::ApiKey', 1)
  })

  it('braucht keinen Cognito User Pool', () => {
    template.resourceCountIs('AWS::Cognito::UserPool', 0)
  })

  it('hat JavaScript-Resolver für order und createOrder', () => {
    for (const [TypeName, FieldName] of [['Query', 'order'], ['Mutation', 'createOrder']]) {
      template.hasResourceProperties('AWS::AppSync::Resolver', {
        TypeName, FieldName, Runtime: { Name: 'APPSYNC_JS', RuntimeVersion: '1.0.0' },
      })
    }
  })

  it('verbindet die Subscription mit createOrder', () => {
    expect(schema()).toContain('@aws_subscribe(mutations: ["createOrder"])')
  })

  it('erlaubt API Key und IAM auf allen Wurzeltypen', () => {
    for (const type of ['Order', 'Query', 'Mutation', 'Subscription'])
      expect(schema()).toMatch(new RegExp(`type ${type} @aws_api_key @aws_iam`))
  })
})
