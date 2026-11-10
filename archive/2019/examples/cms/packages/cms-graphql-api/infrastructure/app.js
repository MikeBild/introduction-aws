const { App } = require('@aws-cdk/cdk');
const CMSGraphQLApi = require('./stack');

const app = new App();
new CMSGraphQLApi(app, 'cms-graphql-api');
app.run();
