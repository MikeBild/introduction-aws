const { join } = require('path');
const { Stack, RemovalPolicy } = require('@aws-cdk/cdk');
const { Bucket, EventType } = require('@aws-cdk/aws-s3');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { S3EventSource } = require('@aws-cdk/aws-lambda-event-sources');

module.exports = class ReportsGenerator extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const requestsBucket = new Bucket(this, 'time-tracker-requests', {
      bucketName     : 'time-tracker-requests',
      removalPolicy  : RemovalPolicy.Destroy,
      retainOnDelete : false,
    });

    const reportsBucket = new Bucket(this, 'time-tracker-reports', {
      bucketName     : 'time-tracker-reports',
      removalPolicy  : RemovalPolicy.Destroy,
      retainOnDelete : false,
    });

    const lambda = new Function(this, 'time-tracker-reports-generator', {
      functionName : 'time-tracker-reports-generator',
      runtime      : Runtime.NodeJS810,
      handler      : 'index.handler',
      code         : Code.asset(join(__dirname, '../dist')),
    });

    requestsBucket.grantReadWrite(lambda.role);
    reportsBucket.grantReadWrite(lambda.role);

    lambda.addEventSource(
      new S3EventSource(requestsBucket, {
        events  : [
          EventType.ObjectCreated,
          EventType.ObjectRemoved,
        ],
        filters : [],
      })
    );
  }
};
