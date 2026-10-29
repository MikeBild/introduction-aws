// TODO: Entferne .skip, sobald Handler und Stack den Parameter Store nutzen.
import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { PaymentsStack } from '../lib/payments-stack.ts'

const template = Template.fromStack(new PaymentsStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe.skip('PaymentsStack', () => {
  it('legt kein Secret als Klartext in Umgebungsvariablen ab', () => {
    const fn = Object.values(template.findResources('AWS::Lambda::Function'))[0]
    const variables = fn?.Properties.Environment.Variables
    expect(Object.keys(variables)).toEqual(['API_KEY_PARAMETER', 'MAX_ITEMS_PARAMETER'])
    expect(variables.API_KEY_PARAMETER).toBe('/orders/payments/api-key')
  })

  it('erlaubt ssm:GetParameter auf den API Key', () => {
    const json = JSON.stringify(template.findResources('AWS::IAM::Policy'))
    expect(json).toContain('ssm:GetParameter')
    expect(json).toContain('parameter/orders/payments/api-key')
  })
})
