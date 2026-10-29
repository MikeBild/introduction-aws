const { App } = require('@aws-cdk/cdk');
const CMSWebApp = require('./stack');
const CMSWebAlias = require('./dns-alias');

const app = new App();

const webapp = new CMSWebApp(app, 'cms-webapp', {
  graphQlApiKey : '',
  graphQlApiUrl : '',
  domainName    : 'mikebild.com',
  hostName      : 'cms-webapp',
  stageName     : 'prod',
});

new CMSWebAlias(app, 'cms-webapp-dns-alias', {
  domainNameRegionalHostedZoneId : webapp.domainNameRegionalHostedZoneId,
  domainNameRegionalDomainName   : webapp.domainNameRegionalDomainName,
  domainName                     : 'mikebild.com',
  hostName                       : 'cms-webapp',
});

app.run();
