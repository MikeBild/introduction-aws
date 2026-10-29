import { App } from 'aws-cdk-lib'
import { MailStack } from '../lib/mail-stack.ts'

const app = new App()
new MailStack(app, 'Ex12-Mail', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
