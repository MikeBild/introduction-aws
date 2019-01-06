const { App } = require('@aws-cdk/cdk');

const CMSGraphQLApi = require('../packages/cms-graphql-api/bin/stack');

const app = new App();

new CMSGraphQLApi(app, 'cms-graphql-api');

app.run();
