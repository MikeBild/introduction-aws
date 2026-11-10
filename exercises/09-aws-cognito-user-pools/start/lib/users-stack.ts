import { Stack, type StackProps } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

export class UsersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // TODO: UserPool 'Users' with self sign-up, login by email, automatic
    //       email verification and passwords of at least 12 characters
    // TODO: App client 'Web' without secret, with userSrp and (for the CLI exercise only) userPassword
    // TODO: CfnOutputs 'UserPoolId' and 'ClientId'
  }
}
