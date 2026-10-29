const { App } = require('@aws-cdk/cdk');
const WebApp = require('./stack');
const WebAlias = require('./dns-alias');

const app = new App();
const webapp = new WebApp(app, 'todo-app', {
  domainName: 'mikebild.com',
  hostName: 'todo-webapp',
  stageName: 'prod',
});
new WebAlias(app, 'todo-webapp-dns-alias', {
  domainNameRegionalHostedZoneId: webapp.domainNameRegionalHostedZoneId,
  domainNameRegionalDomainName: webapp.domainNameRegionalDomainName,
  domainName: 'mikebild.com',
  hostName: 'todo-webapp',
});
app.run();
