const { App } = require('@aws-cdk/cdk');

const CMSCatalog = require('../packages/cms-catalog/bin/stack');
const CMSGraphQLApi = require('../packages/cms-graphql-api/bin/stack');
const CMSSiteGenerator = require('../packages/cms-site-generator/bin/stack');

const app = new App();

const catalog = new CMSCatalog(app, 'cms-catalog');
const siteGenerator = new CMSSiteGenerator(app, 'cms-site-generator', {
  catalogBucket : catalog.catalogBucket,
});

new CMSGraphQLApi(app, 'cms-graphql-api', {
  generatePreviewWebsiteFunction : siteGenerator.generatePreviewWebsiteFunction,
  generateReleaseWebsiteFunction : siteGenerator.generateReleaseWebsiteFunction,
  catalogBucket                  : catalog.catalogBucket,
});

app.run();
