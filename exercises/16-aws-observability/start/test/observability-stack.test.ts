// TODO: Entferne .skip, sobald Logger, Metrics, Tracing und Alarme stehen.
import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { ObservabilityStack } from '../lib/observability-stack.ts'

const template = Template.fromStack(new ObservabilityStack(new App({ context: { 'aws:cdk:bundling-stacks': [] } }), 'Test'))

describe.skip('ObservabilityStack', () => {
  it('aktiviert Tracing mit OpenTelemetry-Layer', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      TracingConfig: { Mode: 'Active' },
      Layers: Match.anyValue(),
      Environment: { Variables: Match.objectLike({ AWS_LAMBDA_EXEC_WRAPPER: '/opt/otel-handler' }) },
    })
  })

  it('alarmiert bei Errors', () => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', { MetricName: 'Errors', Threshold: 5 })
  })

  it('alarmiert bei Nachrichten in der Dead Letter Queue', () => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      MetricName: 'ApproximateNumberOfMessagesVisible',
      Threshold: 1,
      AlarmActions: [Match.anyValue()],
    })
  })
})
