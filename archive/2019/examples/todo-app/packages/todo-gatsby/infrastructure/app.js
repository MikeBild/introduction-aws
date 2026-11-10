const { App } = require('@aws-cdk/cdk');
const GatsbyWebsite = require('./stack');

const app = new App();

new GatsbyWebsite(app, 'todo-gatsby', {
  domainName: 'mikebild.com',
  hostName: 'todo-gatsby',
  region: 'eu-central-1',
});

app.run();
