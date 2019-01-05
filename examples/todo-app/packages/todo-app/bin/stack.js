const { join } = require('path');
const { Stack } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi, EndpointType } = require('@aws-cdk/aws-apigateway');
const { PolicyStatement } = require('@aws-cdk/aws-iam');

module.exports = class WebApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const lambda = new Function(this, 'todo-app-function', {
      functionName : 'todo-app-function',
      runtime      : Runtime.NodeJS810,
      handler      : 'server.handler',
      code         : Code.asset(join(__dirname, '../build')),
    });

    const policy = new PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource('*');
    lambda.role.addToPolicy(policy);

    const api = new LambdaRestApi(this, 'todo-app-api', {
      handler : lambda,
      proxy   : true,
      options : {
        deploy        : true,
        endpointTypes : [
          EndpointType.Regional,
        ],
      },
    });
  }
};
