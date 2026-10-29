import { App } from 'aws-cdk-lib'
import { OrdersGraphqlStack } from '../lib/orders-graphql-stack.ts'

const app = new App()
new OrdersGraphqlStack(app, 'Ex11-OrdersGraphql', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
