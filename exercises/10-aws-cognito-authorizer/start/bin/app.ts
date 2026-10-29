import { App } from 'aws-cdk-lib'
import { SecureOrdersStack } from '../lib/secure-orders-stack.ts'

const app = new App()
new SecureOrdersStack(app, 'Ex10-SecureOrders', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
