const { App } = require('@aws-cdk/cdk');

const CognitoUserPool = require('../packages/userpool-api/infrastructure/cognito');
const UserPoolWebApi = require('../packages/userpool-api/infrastructure/stack');

const domainName = 'mikebild.com';

const app = new App();

const userPool = new CognitoUserPool(app, 'UserPool', {
  defaultUserGroup: 'Users',
});

new UserPoolWebApi(app, 'UserPoolWebAPI', {
  userPoolId: userPool.userPoolId,
  userPoolClientId: userPool.userPoolClientId,
});

app.run();
