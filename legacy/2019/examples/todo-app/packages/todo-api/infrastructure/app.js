const { App } = require('@aws-cdk/cdk');
const CognitoUserPool = require('./cognito-pool');
const WebApi = require('./stack');

const app = new App();

const userPool = new CognitoUserPool(app, 'todo-user-pool', {
  defaultUserGroup: 'Users',
});

new WebApi(app, 'todo-api', {
  userPoolId: userPool.userPoolId,
  userPoolClientId: userPool.userPoolClientId,
});

app.run();
