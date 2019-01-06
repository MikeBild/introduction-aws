const { join } = require('path');
const { Stack, RemovalPolicy } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');

module.exports = class CMSWebSitesGenerator extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const websitesBucket = new Bucket(this, 'WebSitesBucket', {
      bucketName       : 'cms-app-websites',
      removalPolicy    : RemovalPolicy.Orphan,
      retainOnDelete   : false,
      publicReadAccess : true,
    });

    const lambda = new Function(this, 'GenerateWebSite', {
      runtime     : Runtime.NodeJS810,
      handler     : 'index.handler',
      code        : Code.asset(join(__dirname, '../build')),
      environment : { bucketName: websitesBucket.bucketName },
    });
    websitesBucket.grantReadWrite(lambda.role);
  }
};
