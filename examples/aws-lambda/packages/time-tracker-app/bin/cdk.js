const { App, Stack } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { BucketDeployment, Source } = require('@aws-cdk/aws-s3-deployment');
// const { HostedZoneProvider, TXTRecord } = require('@aws-cdk/aws-route53');

class MyStack extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const websiteBucket = new Bucket(this, 'time-tracker-app', {
      bucketName           : 'time-tracker-app.mikebild.com',
      websiteIndexDocument : 'index.html',
      websiteErrorDocument : 'error.html',
      publicReadAccess     : true,
    });
    websiteBucket.grantPublicAccess('*', 's3:GetObject');

    const deployment = new BucketDeployment(this, 'DeployWebsite', {
      source            : Source.asset('./dist'),
      destinationBucket : websiteBucket,
    });

    // const zone = new HostedZoneProvider(this, {
    //   domainName : 'mikebild.com',
    // }).findAndImport(this, 'mikebild.com');

    // new TXTRecord(zone, 'TXTRecord', {
    //   recordName  : 'time-tracker-app',
    //   recordValue :
    //     'time-tracker-app.mikebild.com.s3-website.eu-central-1.amazonaws.com',
    //   ttl         : 90,
    // });
  }
}

const app = new App();
new MyStack(app, 'time-tracker-app');
app.run();
