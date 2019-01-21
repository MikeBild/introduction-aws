const { App } = require('@aws-cdk/cdk');

const API = require('../packages/todo-api/infrastructure/stack');
const WebApp = require('../packages/todo-app/infrastructure/stack');

const app = new App();

const { apiUrl } = new API(app, 'todo-api');
new WebApp(app, 'todo-app', {
  apiUrl
});

app.run();
