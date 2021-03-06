const { join } = require('path');
const { Stack, RemovalPolicy, Output } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { BucketDeployment, Source } = require('@aws-cdk/aws-s3-deployment');
const { HostedZoneProvider, AliasRecord } = require('@aws-cdk/aws-route53');

module.exports = class TodoGatsby extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const { domainName, hostName, region } = props;

    const todoGatsbyBucket = new Bucket(this, 'todoGatsbyBucket', {
      bucketName: `${hostName}.${domainName}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.Orphan,
      retainOnDelete: false,
    });

    const deployment = new BucketDeployment(this, 'TodoGatsbyDeployment', {
      source: Source.asset(join(__dirname, '../public')),
      destinationBucket: todoGatsbyBucket,
      retainOnDelete: false,
    });

    const zone = new HostedZoneProvider(this, {
      domainName,
    }).findAndImport(this, domainName);

    new AliasRecord(this, 'TodoGatsbyAliasRecord', {
      zone,
      recordName: `${hostName}.${domainName}`,
      target: {
        asAliasRecordTarget() {
          return {
            hostedZoneId: 'Z21DNDUVLTQW6Q',
            dnsName: `s3-website.${region}.amazonaws.com`,
          };
        },
      },
    });

    new Output(this, 'Url', {
      value: `http://${hostName}.${domainName}`,
    })
      .makeImportValue()
      .toString();
  }
};
