const { join } = require('path');
const { readFileSync } = require('fs');
const { Stack, RemovalPolicy } = require('@aws-cdk/cdk');
const {
  CfnGraphQLApi,
  CfnApiKey,
  CfnGraphQLSchema,
} = require('@aws-cdk/aws-appsync');
const { Bucket } = require('@aws-cdk/aws-s3');
const {
  Role,
  PolicyStatement,
  PolicyStatementEffect,
  ServicePrincipal,
} = require('@aws-cdk/aws-iam');
const ArticlesListResolver = require('./articles-list');
const ArticlesGetResolver = require('./articles-get');
const ArticlesAddResolver = require('./articles-add');
const ArticlesUpdateResolver = require('./articles-update');

module.exports = class CMSGraphQLApi extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const logsServiceRole = new Role(this, 'CMSGraphQLLogsRole', {
      assumedBy : new ServicePrincipal('logs.amazonaws.com'),
    });
    logsServiceRole.addToPolicy(
      new PolicyStatement(PolicyStatementEffect.Allow)
        .addAction('logs:*')
        .addResource('*')
    );

    const graphQlApi = new CfnGraphQLApi(this, 'CMSGraphQLApi', {
      name               : 'CMSGraphQLApi',
      authenticationType : 'API_KEY',
      logConfig          : {
        cloudWatchLogsRoleArn : logsServiceRole.roleArn,
        fieldLogLevel         : 'ALL',
      },
    });

    const apiKey = new CfnApiKey(this, 'CMSApiKey', {
      apiId : graphQlApi.graphQlApiApiId,
    });

    new CfnGraphQLSchema(this, 'CMSGraphQLApiSchema', {
      apiId      : graphQlApi.graphQlApiApiId,
      definition : readFileSync(join(__dirname, 'schema.graphql')).toString(),
    });

    const lambdaServiceRole = new Role(this, 'CMSGraphQLLambdaRole', {
      assumedBy : new ServicePrincipal('appsync.amazonaws.com'),
    });
    lambdaServiceRole.addToPolicy(
      new PolicyStatement(PolicyStatementEffect.Allow)
        .addAction('lambda:*')
        .addResource('*')
    );

    const cmsBucket = new Bucket(this, 'CMSAppBucket', {
      bucketName     : 'cms-app-data-bucket',
      removalPolicy  : RemovalPolicy.Orphan,
      retainOnDelete : false,
      versioned      : true,
    });

    new ArticlesListResolver(this, 'ArticlesListResolver', {
      lambdaServiceRole,
      graphQlApi,
      cmsBucket,
    });

    new ArticlesGetResolver(this, 'ArticlesGetResolver', {
      lambdaServiceRole,
      graphQlApi,
      cmsBucket,
    });

    new ArticlesAddResolver(this, 'ArticlesAddResolver', {
      lambdaServiceRole,
      graphQlApi,
      cmsBucket,
    });

    new ArticlesUpdateResolver(this, 'ArticlesUpdateResolver', {
      lambdaServiceRole,
      graphQlApi,
      cmsBucket,
    });
  }
};
