const { App } = require('@aws-cdk/cdk');
const WebApp = require('./stack');

const app = new App();
new WebApp(app, 'time-tracker-webapp');
app.run();
