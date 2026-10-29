import { App } from 'aws-cdk-lib'
import { OrdersApiStack } from '../lib/orders-api-stack.ts'

const app = new App()
new OrdersApiStack(app, 'Ex05-OrdersApi', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
