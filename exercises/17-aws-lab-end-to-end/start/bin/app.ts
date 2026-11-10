import { App } from 'aws-cdk-lib'
import { OrdersStack } from '../lib/orders-stack.ts'

// Part one and part two deploy the same stack: part two extends it.
const app = new App()
new OrdersStack(app, 'OrdersStack', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
