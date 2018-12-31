const { join } = require('path');
const { Stack, RemovalPolicy } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { BucketDeployment, Source } = require('@aws-cdk/aws-s3-deployment');
const { HostedZoneProvider, AliasRecord } = require('@aws-cdk/aws-route53');
const { CloudFrontWebDistribution } = require('@aws-cdk/aws-cloudfront');

module.exports = class WebApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const websiteBucket = new Bucket(this, 'BucketWebsite', {
      bucketName           : 'time-tracker-webapp.mikebild.com',
      websiteIndexDocument : 'index.html',
      websiteErrorDocument : 'error.html',
      publicReadAccess     : true,
      removalPolicy        : RemovalPolicy.Destroy,
      retainOnDelete       : false,
    });

    const deployment = new BucketDeployment(this, 'DeployWebsite', {
      source            : Source.asset(join(__dirname, '../dist')),
      destinationBucket : websiteBucket,
    });

    const distribution = new CloudFrontWebDistribution(
      this,
      'DistributionWebSite',
      {
        originConfigs : [
          {
            s3OriginSource : {
              s3BucketSource : websiteBucket,
            },
            behaviors      : [
              { isDefaultBehavior: true },
            ],
          },
        ],
      }
    );

    const zone = new HostedZoneProvider(this, {
      domainName : 'mikebild.com',
    }).findAndImport(this, 'Zone');

    new AliasRecord(zone, 'WebsiteAliasRecord', {
      recordName : 'time-tracker-webapp.mikebild.com',
      target     : distribution,
    });
  }
};
