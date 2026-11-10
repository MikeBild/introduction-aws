import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { OrdersStack } from '../lib/orders-stack.ts'

const template = Template.fromStack(new OrdersStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe('OrdersStack', () => {
  it('creates a table with partition key pk', () => {
    template.hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [{ AttributeName: 'pk', KeyType: 'HASH' }],
    })
  })
  it('uses Node.js 24 on ARM', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs24.x',
      Architectures: ['arm64'],
      Environment: { Variables: { TABLE_NAME: Match.anyValue() } },
    })
  })
  it('grants the function read and write access to the table', () => {
    const policies = template.findResources('AWS::IAM::Policy')
    expect(JSON.stringify(policies)).toContain('dynamodb:PutItem')
  })
})
