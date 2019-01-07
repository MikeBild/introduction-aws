const { App } = require('@aws-cdk/cdk');
const CMSWebApp = require('./stack');

const app = new App();
new CMSWebApp(app, 'cms-webapp');
app.run();
