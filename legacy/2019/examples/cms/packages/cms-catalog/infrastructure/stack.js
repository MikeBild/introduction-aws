const { Stack, RemovalPolicy } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');

module.exports = class CMSWebSitesGenerator extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const catalogBucket = new Bucket(this, 'CMSCatalogBucket', {
      bucketName     : 'cms-app-catalog-bucket',
      removalPolicy  : RemovalPolicy.Orphan,
      retainOnDelete : false,
      versioned      : true,
    });

    this.catalogBucket = catalogBucket.export();
  }
};
