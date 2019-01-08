const { App } = require('@aws-cdk/cdk');
const CMSCatalog = require('./stack');

const app = new App();
new CMSCatalog(app, 'cms-catalog');
app.run();
