const { join } = require('path');
const { Stack, Output } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi, EndpointType } = require('@aws-cdk/aws-apigateway');
const { PolicyStatement } = require('@aws-cdk/aws-iam');

module.exports = class WebApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const lambda = new Function(this, 'todo-app-express', {
      functionName : 'todo-app-express',
      runtime      : Runtime.NodeJS810,
      handler      : 'index.handler',
      code         : Code.asset(join(__dirname, '../dist')),
    });

    const policy = new PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource('*');
    lambda.role.addToPolicy(policy);

    const api = new LambdaRestApi(this, 'todo-app-api', {
      handler : lambda,
      proxy   : false,
      options : {
        deploy        : true,
        deployOptions : {
          stageName : 'prod',
        },
        endpointTypes : [
          EndpointType.Regional,
        ],
      },
    });
    api.root.addMethod('ANY');

    new Output(this, 'url', { value: api.urlForPath() });
  }
};
