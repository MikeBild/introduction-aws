import { App } from 'aws-cdk-lib'
import { ShopTableStack } from '../lib/shop-table-stack.ts'

const app = new App()
new ShopTableStack(app, 'Ex07-ShopTable', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
