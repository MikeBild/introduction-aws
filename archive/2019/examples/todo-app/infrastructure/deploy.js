const { App } = require('@aws-cdk/cdk');

const CognitoUserPool = require('../packages/todo-api/infrastructure/cognito-pool');
const WebApi = require('../packages/todo-api/infrastructure/stack');
const WebApp = require('../packages/todo-app/infrastructure/stack');
const WebAppAlias = require('../packages/todo-app/infrastructure/dns-alias');
const StorybookWebsite = require('../packages/todo-storybook/infrastructure/stack');
const TodoGatsby = require('../packages/todo-gatsby/infrastructure/stack');

const domainName = 'mikebild.com';
const app = new App();

const userPool = new CognitoUserPool(app, 'todo-user-pool', {
  defaultUserGroup: 'Users',
});

const { apiUrl } = new WebApi(app, 'todo-api', {
  userPoolId: userPool.userPoolId,
  userPoolClientId: userPool.userPoolClientId,
});

const webapp = new WebApp(app, 'todo-app', {
  apiUrl,
  domainName,
  hostName: 'todo-webapp',
  stageName: 'prod',
});

new WebAppAlias(app, 'todo-webapp-dns-alias', {
  domainNameRegionalHostedZoneId: webapp.domainNameRegionalHostedZoneId,
  domainNameRegionalDomainName: webapp.domainNameRegionalDomainName,
  domainName,
  hostName: 'todo-webapp',
});

new StorybookWebsite(app, 'todo-storybook', {
  domainName,
  hostName: 'todo-storybook',
  region: 'eu-central-1',
});

new TodoGatsby(app, 'todo-gatsby', {
  domainName,
  hostName: 'todo-gatsby',
  region: 'eu-central-1',
});

app.run();
