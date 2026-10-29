const { join } = require('path');
const {
  Stack,
  RemovalPolicy,
  Output,
  ContextProvider,
} = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi, EndpointType } = require('@aws-cdk/aws-apigateway');
const { Role, ServicePrincipal, PolicyStatement } = require('@aws-cdk/aws-iam');
const { CfnCrawler } = require('@aws-cdk/aws-glue');
const { StringParameter } = require('@aws-cdk/aws-ssm');

module.exports = class WebApi extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const { userPoolId, userPoolClientId } = props;

    const lambda = new Function(this, 'EventApiFunction', {
      functionName: 'event-api',
      runtime: Runtime.NodeJS810,
      handler: 'server.handler',
      code: Code.asset(join(__dirname, '../build')),
      timeout: 60,
      environment: {
        USER_POOL_ID: userPoolId,
        USER_POOL_CLIENT_ID: userPoolClientId,
      },
    });
    lambda.role.attachManagedPolicy(
      'arn:aws:iam::aws:policy/AmazonS3FullAccess'
    );
    lambda.role.attachManagedPolicy(
      'arn:aws:iam::aws:policy/AmazonAthenaFullAccess'
    );

    const eventDataBucket = new Bucket(this, 'EventApiDataBucket', {
      bucketName: 'event-api-data',
      removalPolicy: RemovalPolicy.Orphan,
      retainOnDelete: false,
    });
    eventDataBucket.grantReadWrite(lambda.role);

    const lambdaPolicy = new PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource('*');
    lambda.role.addToPolicy(lambdaPolicy);

    const api = new LambdaRestApi(this, 'EventApiRest', {
      handler: lambda,
      proxy: true,
      options: {
        deploy: true,
        endpointTypes: [EndpointType.Regional],
      },
    });

    this.apiUrl = new Output(this, 'EventApiUrl', {
      value: api.url,
    })
      .makeImportValue()
      .toString();

    new StringParameter(this, 'EventApiUrlParameter', {
      name: 'EventApiUrl',
      stringValue: api.url,
    });

    const glueRole = new Role(this, 'AWSGlueServiceRole', {
      assumedBy: new ServicePrincipal('glue.amazonaws.com'),
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole',
      ],
    });
    eventDataBucket.grantReadWrite(glueRole);

    new CfnCrawler(this, 'EventCrawler', {
      databaseName: 'event-api',
      name: 'EventCrawler',
      role: glueRole.roleName,
      targets: {
        s3Targets: [{ path: `s3://${eventDataBucket.bucketName}/` }],
      },
      schemaChangePolicy: {
        deleteBehavior: 'DEPRECATE_IN_DATABASE',
        updateBehavior: 'UPDATE_IN_DATABASE',
      },
    });
  }
};
