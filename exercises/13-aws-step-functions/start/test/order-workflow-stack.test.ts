// TODO: Remove .skip once Retry, Catch and Choice are in the workflow.
import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { OrderWorkflowStack } from '../lib/order-workflow-stack.ts'

const template = Template.fromStack(new OrderWorkflowStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

// DefinitionString is an Fn::Join of text and function ARNs. For the assertions
// we replace the ARNs with placeholders and parse the definition as JSON.
type Definition = { QueryLanguage: string; StartAt: string; States: Record<string, any> }
const definition = (): Definition => {
  const sm = Object.values(template.findResources('AWS::StepFunctions::StateMachine'))[0]
  const parts: unknown[] = sm?.Properties.DefinitionString['Fn::Join'][1]
  return JSON.parse(parts.map((p) => (typeof p === 'string' ? p : 'ARN')).join(''))
}

describe.skip('OrderWorkflowStack', () => {
  it('is a Standard Workflow with JSONata', () => {
    template.hasResourceProperties('AWS::StepFunctions::StateMachine', { StateMachineType: 'STANDARD' })
    expect(definition().QueryLanguage).toBe('JSONata')
    expect(definition().StartAt).toBe('Bezahlen')
  })

  it('retries the payment on PaymentProviderTimeout with backoff', () => {
    expect(definition().States.Bezahlen.Retry).toContainEqual(
      expect.objectContaining({ ErrorEquals: ['PaymentProviderTimeout'], IntervalSeconds: 2, BackoffRate: 2, MaxAttempts: 3 }),
    )
  })

  it('cancels on PaymentDeclined', () => {
    expect(definition().States.Bezahlen.Catch).toContainEqual(
      expect.objectContaining({ ErrorEquals: ['PaymentDeclined'], Next: 'Stornieren' }),
    )
  })

  it('branches after the stock check', () => {
    const choice = definition().States.Verfuegbar
    expect(choice.Type).toBe('Choice')
    expect(choice.Choices[0]).toMatchObject({ Condition: '{% $states.input.available %}', Next: 'Versenden' })
    expect(choice.Default).toBe('Nachbestellen')
  })
})
