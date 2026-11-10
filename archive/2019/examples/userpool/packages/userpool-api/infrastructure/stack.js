const { join } = require('path');
const { Stack, Output } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi, EndpointType } = require('@aws-cdk/aws-apigateway');
const { PolicyStatement } = require('@aws-cdk/aws-iam');
const { StringParameter } = require('@aws-cdk/aws-ssm');

module.exports = class UserPoolWebApi extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const { userPoolId, userPoolClientId } = props;

    const lambda = new Function(this, 'UserPoolAPIFunction', {
      functionName: 'userpool-api',
      runtime: Runtime.NodeJS810,
      handler: 'server.handler',
      code: Code.asset(join(__dirname, '../build')),
      timeout: 60,
      environment: {
        USER_POOL_ID: userPoolId,
        USER_POOL_CLIENT_ID: userPoolClientId,
      },
    });
    lambda.role.attachManagedPolicy(
      'arn:aws:iam::aws:policy/AmazonS3FullAccess'
    );
    lambda.role.attachManagedPolicy(
      'arn:aws:iam::aws:policy/AmazonAthenaFullAccess'
    );

    const lambdaPolicy = new PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource('*');
    lambda.role.addToPolicy(lambdaPolicy);

    const api = new LambdaRestApi(this, 'UserPoolAPIRest', {
      handler: lambda,
      proxy: true,
      options: {
        deploy: true,
        endpointTypes: [EndpointType.Regional],
      },
    });

    this.apiUrl = new Output(this, 'UserPoolAPIUrl', {
      value: api.url,
    })
      .makeImportValue()
      .toString();

    new StringParameter(this, 'UserPoolAPIUrlParameter', {
      name: 'UserPoolAPIUrl',
      stringValue: api.url,
    });
  }
};
