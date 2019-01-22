const { App } = require('@aws-cdk/cdk');

const API = require('../packages/todo-api/infrastructure/stack');
const WebApp = require('../packages/todo-app/infrastructure/stack');
const WebAppAlias = require('../packages/todo-app/infrastructure/dns-alias');
const StorybookWebsite = require('../packages/todo-storybook/infrastructure/stack');

const app = new App();
const domainName = 'mikebild.com';

const { apiUrl } = new API(app, 'todo-api');

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
});

app.run();
