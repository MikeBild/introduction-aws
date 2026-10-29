import { App } from 'aws-cdk-lib'
import { ColdStartsStack } from '../lib/cold-starts-stack.ts'

const app = new App()
new ColdStartsStack(app, 'Ex15-ColdStarts', {
  env: {
    account: app.node.tryGetContext('account') ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: app.node.tryGetContext('region') ?? process.env.CDK_DEFAULT_REGION,
  },
})
