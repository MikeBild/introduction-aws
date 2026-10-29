import { App } from 'aws-cdk-lib'
import { ObservabilityStack } from '../lib/observability-stack.ts'

const app = new App()
new ObservabilityStack(app, 'Ex16-Observability', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
