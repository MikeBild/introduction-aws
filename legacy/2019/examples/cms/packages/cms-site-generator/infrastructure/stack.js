const { join } = require('path');
const { Stack, RemovalPolicy } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');

module.exports = class CMSWebSitesGenerator extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const catalogBucket = Bucket.import(this, 'CMSCatalogBucket', {
      bucketName : props.catalogBucket.bucketName,
    });

    const previewWebsitesBucket = new Bucket(this, 'PreviewWebsitesBucket', {
      bucketName       : 'cms-app-preview-websites',
      removalPolicy    : RemovalPolicy.Orphan,
      retainOnDelete   : false,
      publicReadAccess : true,
      lifecycleRules   : [
        {
          expirationInDays : 30,
          enabled          : true,
        },
      ],
    });
    this.previewWebsitesBucket = previewWebsitesBucket.export();

    const generatePreviewWebsite = new Function(
      this,
      'GeneratePreviewWebsite',
      {
        runtime     : Runtime.NodeJS810,
        handler     : 'preview.handler',
        code        : Code.asset(join(__dirname, '../build')),
        environment : {
          webSiteBucketName : previewWebsitesBucket.bucketName,
          catalogBucketName : catalogBucket.bucketName,
        },
      }
    );

    previewWebsitesBucket.grantReadWrite(generatePreviewWebsite.role);
    catalogBucket.grantReadWrite(generatePreviewWebsite.role);
    this.generatePreviewWebsiteFunction = generatePreviewWebsite.export();

    const releaseWebsitesBucket = new Bucket(this, 'ReleaseWebsitesBucket', {
      bucketName       : 'cms-app-release-websites',
      removalPolicy    : RemovalPolicy.Orphan,
      retainOnDelete   : false,
      publicReadAccess : true,
    });
    this.releaseWebsitesBucket = releaseWebsitesBucket.export();

    const generateReleaseWebsite = new Function(
      this,
      'GenerateReleaseWebsite',
      {
        runtime     : Runtime.NodeJS810,
        handler     : 'release.handler',
        code        : Code.asset(join(__dirname, '../build')),
        environment : {
          webSiteBucketName : releaseWebsitesBucket.bucketName,
          catalogBucketName : catalogBucket.bucketName,
        },
      }
    );

    releaseWebsitesBucket.grantReadWrite(generateReleaseWebsite.role);
    catalogBucket.grantReadWrite(generateReleaseWebsite.role);
    this.generateReleaseWebsiteFunction = generateReleaseWebsite.export();
  }
};
