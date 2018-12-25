const { App, Stack, RemovalPolicy } = require('@aws-cdk/cdk');
const { Bucket, EventType } = require('@aws-cdk/aws-s3');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { S3EventSource } = require('@aws-cdk/aws-lambda-event-sources');

class MyStack extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const requestsBucket = new Bucket(this, 'time-tracker-requests', {
      bucketName       : 'time-tracker-requests',
      removalPolicy    : RemovalPolicy.Destroy,
      publicReadAccess : true,
    });

    const reportsBucket = new Bucket(this, 'time-tracker-reports', {
      bucketName       : 'time-tracker-reports',
      removalPolicy    : RemovalPolicy.Destroy,
      publicReadAccess : true,
    });

    const lambda = new Function(this, 'time-tracker-report-generator', {
      functionName : 'time-tracker-report-generator',
      runtime      : Runtime.NodeJS810,
      handler      : 'index.handler',
      code         : Code.asset('./dist'),
    });

    requestsBucket.grantRead(lambda.role);
    reportsBucket.grantReadWrite(lambda.role);

    // lambda.addEventSource(
    //   new S3EventSource(reportsBucket, {
    //     events : [
    //       EventType.ObjectCreated,
    //       EventType.ObjectDeleted,
    //     ],
    //   })
    // );
  }
}

const app = new App();
const stack = new MyStack(app, 'time-tracker-report-generator');
app.run();
