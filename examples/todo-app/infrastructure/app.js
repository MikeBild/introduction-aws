const { App } = require('@aws-cdk/cdk');

const API = require('../packages/todo-api/infrastructure/stack');
const WebApp = require('../packages/todo-app/infrastructure/stack');
const StorybookWebsite = require('../packages/todo-storybook/infrastructure/stack');

const app = new App();

const { apiUrl } = new API(app, 'todo-api');

new WebApp(app, 'todo-app', {
  apiUrl
});

new StorybookWebsite(app, 'todo-storybook', {
  domainName: 'mikebild.com',
  hostName: 'todo-storybook',
});

app.run();
