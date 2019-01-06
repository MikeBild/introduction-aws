const { App } = require('@aws-cdk/cdk');

const CMSGraphQLApi = require('../packages/cms-graphql-api/bin/stack');
const CMSSiteGenerator = require('../packages/cms-site-generator/bin/stack');

const app = new App();

const siteGenerator = new CMSSiteGenerator(app, 'cms-site-generator');
new CMSGraphQLApi(app, 'cms-graphql-api', {
  siteGeneratorFunction: siteGenerator.siteGeneratorFunction,
});

app.run();
