import { Stack, type StackProps } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

export class UsersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // TODO: UserPool 'Users' mit Self Sign-up, Login per E-Mail, automatischer
    //       Verifizierung der E-Mail und Passwörtern ab 12 Zeichen
    // TODO: App Client 'Web' ohne Secret, mit userSrp und (nur für die CLI-Übung) userPassword
    // TODO: CfnOutputs 'UserPoolId' und 'ClientId'
  }
}
