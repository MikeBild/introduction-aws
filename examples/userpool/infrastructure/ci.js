const { App } = require('@aws-cdk/cdk');
const UserPoolCIPipeline = require('./ci-pipeline');

const app = new App();

new UserPoolCIPipeline(app, 'UserPoolCIPipeline');

app.run();
