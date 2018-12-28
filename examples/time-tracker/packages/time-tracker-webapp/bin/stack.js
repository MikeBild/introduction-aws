const { join } = require('path');
const { Stack, RemovalPolicy } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { BucketDeployment, Source } = require('@aws-cdk/aws-s3-deployment');

module.exports = class WebApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const websiteBucket = new Bucket(this, 'time-tracker-webapp', {
      bucketName           : 'time-tracker-webapp.mikebild.com',
      websiteIndexDocument : 'index.html',
      websiteErrorDocument : 'error.html',
      publicReadAccess     : true,
      removalPolicy        : RemovalPolicy.Destroy,
      retainOnDelete       : false,
    });
    websiteBucket.grantPublicAccess('*', 's3:GetObject');

    const deployment = new BucketDeployment(this, 'DeployWebsite', {
      source            : Source.asset(join(__dirname, '../dist')),
      destinationBucket : websiteBucket,
    });
  }
};
