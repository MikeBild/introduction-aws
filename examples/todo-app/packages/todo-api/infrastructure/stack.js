const { join } = require('path');
const { Stack, RemovalPolicy, Output } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi, EndpointType } = require('@aws-cdk/aws-apigateway');
const { Role, ServicePrincipal, PolicyStatement } = require('@aws-cdk/aws-iam');
const { CfnCrawler } = require('@aws-cdk/aws-glue');

module.exports = class WebApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const lambda = new Function(this, 'todo-api-function', {
      functionName: 'todo-api',
      runtime: Runtime.NodeJS810,
      handler: 'server.handler',
      code: Code.asset(join(__dirname, '../build')),
    });
    lambda.role.attachManagedPolicy(
      'arn:aws:iam::aws:policy/AmazonS3FullAccess'
    );
    lambda.role.attachManagedPolicy(
      'arn:aws:iam::aws:policy/AmazonAthenaFullAccess'
    );

    const todosBucket = new Bucket(this, 'todo-app-todos', {
      bucketName: 'todo-app-todos',
      removalPolicy: RemovalPolicy.Orphan,
      retainOnDelete: false,
    });
    todosBucket.grantReadWrite(lambda.role);

    const lambdaPolicy = new PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource('*');
    lambda.role.addToPolicy(lambdaPolicy);

    const api = new LambdaRestApi(this, 'todo-api', {
      handler: lambda,
      proxy: true,
      options: {
        deploy: true,
        endpointTypes: [
          EndpointType.Regional,
        ],
      },
    });

    this.apiUrl = new Output(this, 'ApiUrl', {
      value: api.url,
    })
      .makeImportValue()
      .toString();

    const glueRole = new Role(this, 'AWSGlueServiceRole', {
      assumedBy: new ServicePrincipal('glue.amazonaws.com'),
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole',
      ],
    });
    todosBucket.grantReadWrite(glueRole);

    new CfnCrawler(this, 'TodosCrawler', {
      databaseName: 'todo-app',
      name: 'TodosCrawler',
      role: glueRole.roleName,
      targets: {
        s3Targets: [
          { path: `s3://${todosBucket.bucketName}/` },
        ],
      },
      schemaChangePolicy: {
        deleteBehavior: 'DEPRECATE_IN_DATABASE',
        updateBehavior: 'UPDATE_IN_DATABASE',
      }
    });
  }
};
