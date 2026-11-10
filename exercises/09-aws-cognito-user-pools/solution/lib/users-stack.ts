import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AccountRecovery, UserPool } from 'aws-cdk-lib/aws-cognito'
import type { Construct } from 'constructs'

export class UsersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const userPool = new UserPool(this, 'Users', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: { minLength: 12 },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    // Public client for browser and CLI: without secret.
    const webClient = userPool.addClient('Web', {
      authFlows: {
        userSrp: true,
        // For the exercise only: allows login via the CLI without an SRP library.
        userPassword: true,
      },
      generateSecret: false,
    })

    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId })
    new CfnOutput(this, 'ClientId', { value: webClient.userPoolClientId })
  }
}
