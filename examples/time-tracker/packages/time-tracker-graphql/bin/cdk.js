const { App, Stack } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi, EndpointType } = require('@aws-cdk/aws-apigateway');
const { PolicyStatement } = require('@aws-cdk/aws-iam');
class MyStack extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const lambda = new Function(this, 'time-tracker-graphql-function', {
      functionName : 'time-tracker-graphql',
      runtime      : Runtime.NodeJS810,
      handler      : 'index.handler',
      code         : Code.asset('./dist'),
    });

    const policy = new PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource('*');
    lambda.role.addToPolicy(policy);

    const api = new LambdaRestApi(this, 'time-tracker-graphql-api', {
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

    const requestsBucket = Bucket.import(this, 'time-tracker-requests', {
      bucketName : 'time-tracker-requests',
    });
    requestsBucket.grantReadWrite(lambda.role);
  }
}

const app = new App();
const stack = new MyStack(app, 'time-tracker-graphql');
app.run();
