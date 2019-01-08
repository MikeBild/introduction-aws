const { App } = require('@aws-cdk/cdk');

const CMSCatalog = require('../packages/cms-catalog/bin/stack');
const CMSGraphQLApi = require('../packages/cms-graphql-api/bin/stack');
const CMSSiteGenerator = require('../packages/cms-site-generator/bin/stack');
const CMSWebApp = require('../packages/cms-webapp/bin/stack');

const app = new App();

// Data Catalog
const catalog = new CMSCatalog(app, 'cms-catalog');

// Preview and Release WebSite Generation
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
new CMSWebApp(app, 'cms-webapp', {
  graphQlApiKey : graphQlApi.graphQlApiKey,
  graphQlApiUrl : graphQlApi.graphQlApiUrl,
});

app.run();
