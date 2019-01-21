const { App } = require('@aws-cdk/cdk');
const WebApp = require('./stack');

const app = new App();
new WebApp(app, 'todo-app');
app.run();
