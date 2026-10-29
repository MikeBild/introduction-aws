const { App } = require('@aws-cdk/cdk');
const StorybookWebsite = require('./stack');

const app = new App();

new StorybookWebsite(app, 'todo-storybook', {
  domainName: 'mikebild.com',
  hostName: 'todo-storybook',
  region: 'eu-central-1',
});

app.run();
