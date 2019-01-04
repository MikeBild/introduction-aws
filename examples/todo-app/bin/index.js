const { App } = require('@aws-cdk/cdk');

const API = require('../packages/todo-api/bin/stack');
const WebApp = require('../packages/todo-app/bin/stack');

const app = new App();

new API(app, 'todo-api');
new WebApp(app, 'todo-app');

app.run();
