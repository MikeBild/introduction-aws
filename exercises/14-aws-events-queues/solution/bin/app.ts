import { App } from 'aws-cdk-lib'
import { OrderEventsStack } from '../lib/order-events-stack.ts'

const app = new App()
new OrderEventsStack(app, 'Ex14-OrderEvents', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
