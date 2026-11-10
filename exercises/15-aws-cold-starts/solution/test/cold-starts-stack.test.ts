import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { ColdStartsStack } from '../lib/cold-starts-stack.ts'

describe('ColdStartsStack', () => {
  it('takes memorySize from the context', () => {
    const app = new App({ context: { 'aws:cdk:bundling-stacks': [], memorySize: 1769 } })
    Template.fromStack(new ColdStartsStack(app, 'Test')).hasResourceProperties('AWS::Lambda::Function', {
      MemorySize: 1769,
      Runtime: 'nodejs24.x',
    })
  })
})
