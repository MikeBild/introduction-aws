// TODO: Remove .skip once you grant the permissions with grant methods.
import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { OrdersStack } from '../lib/orders-stack.ts'

const template = Template.fromStack(new OrdersStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

type Statement = { Action: string | string[]; Resource: unknown }
type Policy = { Properties: { PolicyDocument: { Statement: Statement[] }; Roles: { Ref: string }[] } }

// Collects all allowed actions per function (via its role).
const actionsOf = (functionId: string) => {
  const policies = Object.values(template.findResources('AWS::IAM::Policy')) as Policy[]
  return policies
    .filter((p) => p.Properties.Roles.some((r) => r.Ref.startsWith(`${functionId}ServiceRole`)))
    .flatMap((p) => p.Properties.PolicyDocument.Statement)
    .flatMap((s) => [s.Action].flat())
}

describe.skip('Least Privilege', () => {
  it('ListOrders may read but not write', () => {
    const actions = actionsOf('ListOrders')
    expect(actions).toContain('dynamodb:Query')
    expect(actions).not.toContain('dynamodb:PutItem')
  })

  it('PlaceOrder may write but not read', () => {
    const actions = actionsOf('PlaceOrder')
    expect(actions).toContain('dynamodb:PutItem')
    expect(actions).not.toContain('dynamodb:Query')
    expect(actions).not.toContain('dynamodb:GetItem')
  })

  it('uses no wildcards in actions or resources', () => {
    const json = JSON.stringify(template.findResources('AWS::IAM::Policy'))
    expect(json).not.toContain('"dynamodb:*"')
    expect(json).not.toContain('"Resource":"*"')
  })
})
