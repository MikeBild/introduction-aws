const { App } = require('@aws-cdk/cdk');
const ReportsGenerator = require('./stack');

const app = new App();
new ReportsGenerator(app, 'time-tracker-reports-generator');
app.run();
