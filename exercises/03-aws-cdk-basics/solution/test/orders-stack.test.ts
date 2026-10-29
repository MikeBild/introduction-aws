import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { OrdersStack } from '../lib/orders-stack.ts'

const template = Template.fromStack(new OrdersStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe('OrdersStack', () => {
  it('legt eine Table mit Partition Key pk an', () => {
    template.hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [{ AttributeName: 'pk', KeyType: 'HASH' }],
    })
  })
  it('nutzt Node.js 24 auf ARM', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs24.x',
      Architectures: ['arm64'],
      Environment: { Variables: { TABLE_NAME: Match.anyValue() } },
    })
  })
  it('gibt der Function Lese- und Schreibrechte auf die Table', () => {
    const policies = template.findResources('AWS::IAM::Policy')
    expect(JSON.stringify(policies)).toContain('dynamodb:PutItem')
  })
})
