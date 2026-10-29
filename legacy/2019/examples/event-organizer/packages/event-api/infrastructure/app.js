const { App } = require('@aws-cdk/cdk');
const WebApi = require('./stack');

const app = new App();

new WebApi(app, 'event-api', {
  userPoolId: process.env.USER_POOL_ID,
  userPoolClientId: process.env.USER_POOL_CLIENT_ID,
});

app.run();
