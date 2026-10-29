import { App } from 'aws-cdk-lib'
import { OrderWorkflowStack } from '../lib/order-workflow-stack.ts'

const app = new App()
new OrderWorkflowStack(app, 'Ex13-OrderWorkflow', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
