const { join } = require('path');
const { Stack, Output } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi, EndpointType } = require('@aws-cdk/aws-apigateway');
const { PolicyStatement } = require('@aws-cdk/aws-iam');

module.exports = class WebApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const lambda = new Function(this, 'todo-api-function', {
      functionName : 'todo-api',
      runtime      : Runtime.NodeJS810,
      handler      : 'server.handler',
      code         : Code.asset(join(__dirname, '../build')),
    });

    const policy = new PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource('*');
    lambda.role.addToPolicy(policy);

    const api = new LambdaRestApi(this, 'todo-api', {
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
