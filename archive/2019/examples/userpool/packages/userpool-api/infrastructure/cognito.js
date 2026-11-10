const { Stack, Output } = require('@aws-cdk/cdk');
const {
  CfnUserPool,
  CfnUserPoolClient,
  CfnUserPoolGroup,
  CfnUserPoolUser,
} = require('@aws-cdk/aws-cognito');

module.exports = class CognitoUserPool extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const { defaultUserGroup } = props;

    const userPool = new CfnUserPool(this, 'UserPool', {
      userPoolName: 'UserPool',
      adminCreateUserConfig: {
        allowAdminCreateUserOnly: false,
      },
      policies: {
        passwordPolicy: {
          minimumLength: 6,
        },
      },
      schema: [
        {
          attributeDataType: 'String',
          name: 'email',
          required: true,
        },
      ],
      autoVerifiedAttributes: ['email'],
    });

    this.userPoolId = new Output(this, 'UserPoolId', {
      value: userPool.userPoolId,
    })
      .makeImportValue()
      .toString();

    const userPoolClient = new CfnUserPoolClient(this, 'UserPoolClient', {
      clientName: 'UserPoolClient',
      explicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
      refreshTokenValidity: 30,
      userPoolId: userPool.userPoolId,
    });

    this.userPoolClientId = new Output(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    })
      .makeImportValue()
      .toString();

    new CfnUserPoolGroup(this, 'GroupUsers', {
      groupName: defaultUserGroup,
      userPoolId: userPool.userPoolId,
    });
  }
};