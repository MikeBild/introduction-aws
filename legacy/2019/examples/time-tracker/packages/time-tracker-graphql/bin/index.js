const { App } = require('@aws-cdk/cdk');
const GraphQL = require('./stack');

const app = new App();
new GraphQL(app, 'time-tracker-graphql');
app.run();
