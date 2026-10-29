import { App } from 'aws-cdk-lib'
import { OrdersStack } from '../lib/orders-stack.ts'

const app = new App()
new OrdersStack(app, 'Ex03-Orders', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
