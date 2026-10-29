import { App } from 'aws-cdk-lib'
import { OrdersTableStack } from '../lib/orders-table-stack.ts'

const app = new App()
new OrdersTableStack(app, 'Ex06-OrdersTable', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
