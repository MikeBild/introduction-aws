import { App } from 'aws-cdk-lib'
import { UsersStack } from '../lib/users-stack.ts'

const app = new App()
new UsersStack(app, 'Ex09-Users', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
