const { App } = require('@aws-cdk/cdk');
const TodoAppCiPipeline = require('./ci-pipeline');

const app = new App();

new TodoAppCiPipeline(app, 'todo-app-ci-pipeline');

app.run();
