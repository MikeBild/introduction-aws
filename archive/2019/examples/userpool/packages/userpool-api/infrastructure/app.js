#!/usr/bin/env node

const { App } = require('@aws-cdk/cdk');
const CognitoUserPool = require('./cognito');
const UserPoolWebAPI = require('./stack');

const app = new App();

const userPool = new CognitoUserPool(app, 'UserPool', {
  defaultUserGroup: 'Users',
});

new UserPoolWebAPI(app, 'UserPoolWebAPI', {
  userPoolId: userPool.userPoolId,
  userPoolClientId: userPool.userPoolClientId,
});

app.run();
