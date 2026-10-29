import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { OrderWorkflowStack } from '../lib/order-workflow-stack.ts'

const template = Template.fromStack(new OrderWorkflowStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

// DefinitionString ist ein Fn::Join aus Text und Function-ARNs. Für die Prüfung
// ersetzen wir die ARNs durch Platzhalter und lesen die Definition als JSON.
type Definition = { QueryLanguage: string; StartAt: string; States: Record<string, any> }
const definition = (): Definition => {
  const sm = Object.values(template.findResources('AWS::StepFunctions::StateMachine'))[0]
  const parts: unknown[] = sm?.Properties.DefinitionString['Fn::Join'][1]
  return JSON.parse(parts.map((p) => (typeof p === 'string' ? p : 'ARN')).join(''))
}

describe('OrderWorkflowStack', () => {
  it('ist ein Standard Workflow mit JSONata', () => {
    template.hasResourceProperties('AWS::StepFunctions::StateMachine', { StateMachineType: 'STANDARD' })
    expect(definition().QueryLanguage).toBe('JSONata')
    expect(definition().StartAt).toBe('Bezahlen')
  })

  it('wiederholt die Zahlung bei PaymentProviderTimeout mit Backoff', () => {
    expect(definition().States.Bezahlen.Retry).toContainEqual(
      expect.objectContaining({ ErrorEquals: ['PaymentProviderTimeout'], IntervalSeconds: 2, BackoffRate: 2, MaxAttempts: 3 }),
    )
  })

  it('storniert bei PaymentDeclined', () => {
    expect(definition().States.Bezahlen.Catch).toContainEqual(
      expect.objectContaining({ ErrorEquals: ['PaymentDeclined'], Next: 'Stornieren' }),
    )
  })

  it('verzweigt nach der Lagerprüfung', () => {
    const choice = definition().States.Verfuegbar
    expect(choice.Type).toBe('Choice')
    expect(choice.Choices[0]).toMatchObject({ Condition: '{% $states.input.available %}', Next: 'Versenden' })
    expect(choice.Default).toBe('Nachbestellen')
  })
})
