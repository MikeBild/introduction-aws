const { App } = require('@aws-cdk/cdk');

const WebApp = require('../packages/time-tracker-webapp/bin/stack');
const GraphQL = require('../packages/time-tracker-graphql/bin/stack');
const ReportsGenerator = require('../packages/time-tracker-reports-generator/bin/stack');
const RequestConfirmation = require('../packages/time-tracker-request-confirmation/bin/stack');

const app = new App();

new ReportsGenerator(app, 'time-tracker-reports-generator');
new RequestConfirmation(app, 'time-tracker-request-confirmation');
new GraphQL(app, 'time-tracker-graphql');
new WebApp(app, 'time-tracker-webapp');

app.run();
