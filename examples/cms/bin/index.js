const { App } = require('@aws-cdk/cdk');

const CMSUserProfile = require('../packages/cms-user-profile/bin/stack');
const CMSCatalog = require('../packages/cms-catalog/bin/stack');
const CMSGraphQLApi = require('../packages/cms-graphql-api/bin/stack');
const CMSSiteGenerator = require('../packages/cms-site-generator/bin/stack');
const CMSWebApp = require('../packages/cms-webapp/bin/stack');
const CMSWebAppDNSAlias = require('../packages/cms-webapp/bin/dns-alias');

const app = new App();

// Data Catalog (Articles, etc.)
const catalog = new CMSCatalog(app, 'cms-catalog');

// User Profile
const userProfile = new CMSUserProfile(app, 'cms-user-profile');

// WebSite Generation (Article- Preview/Release)
const siteGenerator = new CMSSiteGenerator(app, 'cms-site-generator', {
  catalogBucket : catalog.catalogBucket,
});

// CMS GraphQL API
const graphQlApi = new CMSGraphQLApi(app, 'cms-graphql-api', {
  generatePreviewWebsiteFunction : siteGenerator.generatePreviewWebsiteFunction,
  generateReleaseWebsiteFunction : siteGenerator.generateReleaseWebsiteFunction,
  catalogBucket                  : catalog.catalogBucket,
});

// CMS WebApp
const webapp = new CMSWebApp(app, 'cms-webapp', {
  graphQlApiKey : graphQlApi.graphQlApiKey,
  graphQlApiUrl : graphQlApi.graphQlApiUrl,
  domainName    : 'mikebild.com',
  hostName      : 'cms-webapp',
  stageName     : 'prod',
});

// CMS WebApp DNS Alias
new CMSWebAppDNSAlias(app, 'cms-webapp-dns-alias', {
  domainNameRegionalHostedZoneId : webapp.domainNameRegionalHostedZoneId,
  domainNameRegionalDomainName   : webapp.domainNameRegionalDomainName,
  domainName                     : 'mikebild.com',
  hostName                       : 'cms-webapp',
});

app.run();
