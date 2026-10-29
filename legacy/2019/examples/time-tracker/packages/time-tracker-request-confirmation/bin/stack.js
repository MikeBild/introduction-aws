const { join } = require('path');
const { Stack } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { PolicyStatement } = require('@aws-cdk/aws-iam');
const {
  Activity,
  Task,
  Pass,
  StateMachine,
} = require('@aws-cdk/aws-stepfunctions');

module.exports = class RequestConfirmation extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const requestLambda = new Function(this, 'time-tracker-request-function', {
      functionName : 'time-tracker-request',
      runtime      : Runtime.NodeJS810,
      handler      : 'request.handler',
      code         : Code.asset(join(__dirname, '../dist')),
    });

    const policy = new PolicyStatement().addAction('states:*').addResource('*');
    requestLambda.role.addToPolicy(policy);

    const confirmationLambda = new Function(
      this,
      'time-tracker-confirmation-function',
      {
        functionName : 'time-tracker-confirmation',
        runtime      : Runtime.NodeJS810,
        handler      : 'confirmation.handler',
        code         : Code.asset(join(__dirname, '../dist')),
      }
    );

    const activity = new Activity(this, 'time-tracker-wait-for-confirmation', {
      activityName : 'WaitForConfirmation',
    });

    const task = new Task(this, 'WaitForConfirmation', {
      resource : activity,
    });

    const pass = new Pass(this, 'Pass', {});

    const definition = task.next(pass);

    const stateMachine = new StateMachine(
      this,
      'time-tracker-request-confirmation',
      {
        stateMachineName : 'Time-Tracker-Request-Confirmation',
        timeoutSec       : 120,
        definition,
      }
    );
  }
};
