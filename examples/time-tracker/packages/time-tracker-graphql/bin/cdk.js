const { App, Stack, Output } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi, EndpointType } = require('@aws-cdk/aws-apigateway');

class MyStack extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const backend = new Function(this, 'time-tracker-graphql-function', {
      functionName : 'time-tracker-graphql',
      runtime      : Runtime.NodeJS810,
      handler      : 'index.handler',
      code         : Code.asset('./dist'),
    });

    const api = new LambdaRestApi(this, 'time-tracker-graphql-api', {
      handler : backend,
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
  }
}

const app = new App();
const stack = new MyStack(app, 'time-tracker-graphql');
app.run();
