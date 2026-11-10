import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { UsersStack } from '../lib/users-stack.ts'

const template = Template.fromStack(new UsersStack(new App(), 'Test'))

describe('UsersStack', () => {
  it('signs in with email', () => {
    template.hasResourceProperties('AWS::Cognito::UserPool', {
      UsernameAttributes: ['email'],
      AutoVerifiedAttributes: ['email'],
    })
  })

  it('has an app client without secret with SRP', () => {
    template.hasResourceProperties('AWS::Cognito::UserPoolClient', {
      GenerateSecret: false,
      ExplicitAuthFlows: ['ALLOW_USER_PASSWORD_AUTH', 'ALLOW_USER_SRP_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH'],
    })
  })
})
