const { App } = require('@aws-cdk/cdk');
const CMSSiteGenerator = require('./stack');

const app = new App();
new CMSSiteGenerator(app, 'cms-site-generator');
app.run();
