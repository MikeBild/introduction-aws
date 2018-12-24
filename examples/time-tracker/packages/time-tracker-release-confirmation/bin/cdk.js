const { App, Stack, Output } = require('@aws-cdk/cdk');
const {} = require('@aws-cdk/aws-stepfunctions');

class MyStack extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
  }
}

const app = new App();
const stack = new MyStack(app, 'time-tracker-release-confirmation');
app.run();
