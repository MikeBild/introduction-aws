const { join } = require('path');
const { readFileSync } = require('fs');
const { Stack, RemovalPolicy, Output } = require('@aws-cdk/cdk');
const {
  CfnGraphQLApi,
  CfnApiKey,
  CfnGraphQLSchema,
  CfnDataSource,
} = require('@aws-cdk/aws-appsync');
const { Bucket } = require('@aws-cdk/aws-s3');
const {
  Role,
  PolicyStatement,
  PolicyStatementEffect,
  ServicePrincipal,
} = require('@aws-cdk/aws-iam');
const ArticleListResolver = require('./article/list');
const ArticleGetResolver = require('./article/get');
const ArticleAddResolver = require('./article/add');
const ArticleUpdateResolver = require('./article/update');
const ArticlePreviewResolver = require('./article/preview');
const UserProfileListResolver = require('./user-profile/list');
const UserProfileGetResolver = require('./user-profile/get');
const PreviewGetResolver = require('./preview/get');

module.exports = class CMSGraphQLApi extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const logsServiceRole = new Role(this, 'CMSGraphQLLogsRole', {
      assumedBy : new ServicePrincipal('appsync.amazonaws.com'),
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
    this.graphQlApiUrl = new Output(this, 'GraphQlApiUrl', {
      value : graphQlApi.graphQlApiGraphQlUrl,
    })
      .makeImportValue()
      .toString();

    const apiKey = new CfnApiKey(this, 'CMSApiKey', {
      apiId : graphQlApi.graphQlApiApiId,
    });
    this.graphQlApiKey = new Output(this, 'GraphQlApiKey', {
      value : apiKey.apiKey,
    })
      .makeImportValue()
      .toString();

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

    const previewWebSitesBucket = Bucket.import(this, 'PreviewWebsitesBucket', {
      bucketName : props.previewWebsitesBucket.bucketName,
    });

    new ArticleListResolver(this, 'ArticleListResolver', {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
    });

    new ArticleGetResolver(this, 'ArticleGetResolver', {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
    });

    new ArticleAddResolver(this, 'ArticleAddResolver', {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
    });

    new ArticleUpdateResolver(this, 'ArticleUpdateResolver', {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
    });

    new ArticlePreviewResolver(this, 'ArticlePreviewResolver', {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
      generatePreviewWebsiteFunction : props.generatePreviewWebsiteFunction,
    });

    new PreviewGetResolver(this, 'ArticlePreviewGetResolver', {
      lambdaServiceRole,
      graphQlApi,
      previewWebSitesBucket,
    });

    const dynamoDBServiceRole = new Role(this, 'CMSGraphQLDynamoDBRole', {
      assumedBy : new ServicePrincipal('appsync.amazonaws.com'),
    });
    dynamoDBServiceRole.addToPolicy(
      new PolicyStatement(PolicyStatementEffect.Allow)
        .addAction('dynamodb:*')
        .addResource('*')
    );

    const userProfilesDataSource = new CfnDataSource(
      this,
      'UserProfilesDataSource',
      {
        name           : 'UserProfiles',
        type           : 'AMAZON_DYNAMODB',
        apiId          : graphQlApi.graphQlApiApiId,
        dynamoDbConfig : {
          tableName : 'UserProfiles',
          awsRegion : 'eu-central-1',
        },
        serviceRoleArn : dynamoDBServiceRole.roleArn,
      }
    );

    new UserProfileListResolver(this, 'UserProfileListResolver', {
      graphQlApi,
      userProfilesDataSource,
    });

    new UserProfileGetResolver(this, 'UserProfileGetResolver', {
      graphQlApi,
      userProfilesDataSource,
    });
  }
};
