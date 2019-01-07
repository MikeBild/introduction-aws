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
const ArticlesPreviewResolver = require('./articles-preview');

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

    const catalogBucket = Bucket.import(this, 'CMSCatalogBucket', {
      bucketName : props.catalogBucket.bucketName,
    });

    new ArticlesListResolver(this, 'ArticlesListResolver', {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
    });

    new ArticlesGetResolver(this, 'ArticlesGetResolver', {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
    });

    new ArticlesAddResolver(this, 'ArticlesAddResolver', {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
    });

    new ArticlesUpdateResolver(this, 'ArticlesUpdateResolver', {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
    });

    new ArticlesPreviewResolver(this, 'ArticlesPreviewResolver', {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
      generatePreviewWebsiteFunction : props.generatePreviewWebsiteFunction,
    });
  }
};
