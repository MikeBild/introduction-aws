const { App } = require('@aws-cdk/cdk');
const RequestConfirmation = require('./stack');

const app = new App();
new RequestConfirmation(app, 'time-tracker-request-confirmation');
app.run();
