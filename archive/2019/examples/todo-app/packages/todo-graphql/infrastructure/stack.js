const { join } = require('path');
const { readFileSync } = require('fs');
const { Stack, Output } = require('@aws-cdk/cdk');
const {
  CfnGraphQLApi,
  CfnGraphQLSchema,
  CfnDataSource,
  CfnResolver,
} = require('@aws-cdk/aws-appsync');
const {
  Role,
  PolicyStatement,
  PolicyStatementEffect,
  ServicePrincipal,
} = require('@aws-cdk/aws-iam');

module.exports = class TodoGraphQLApi extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const { awsRegion, userPoolId, todoApiEndpoint } = props;

    const logsServiceRole = new Role(this, 'TodoGraphQLLogsRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
    });
    logsServiceRole.addToPolicy(
      new PolicyStatement(PolicyStatementEffect.Allow)
        .addAction('logs:*')
        .addResource('*')
    );

    const graphQlApi = new CfnGraphQLApi(this, 'TodoGraphQLApi', {
      name: 'TodoGraphQLApi',
      authenticationType: 'AMAZON_COGNITO_USER_POOLS',
      userPoolConfig: {
        awsRegion,
        userPoolId,
        defaultAction: 'DENY',
      },
      logConfig: {
        cloudWatchLogsRoleArn: logsServiceRole.roleArn,
        fieldLogLevel: 'ALL',
      },
    });
    this.graphQlApiUrl = new Output(this, 'GraphQlApiUrl', {
      value: graphQlApi.graphQlApiGraphQlUrl,
    })
      .makeImportValue()
      .toString();

    new CfnGraphQLSchema(this, 'TodoGraphQLApiSchema', {
      apiId: graphQlApi.graphQlApiApiId,
      definition: readFileSync(join(__dirname, 'schema.graphql')).toString(),
    });

    const httpDataSource = new CfnDataSource(this, 'HttpDataSource', {
      name: 'HttpDataSource',
      type: 'HTTP',
      apiId: graphQlApi.graphQlApiApiId,
      httpConfig: {
        endpoint: todoApiEndpoint,
      },
    });

    new CfnResolver(this, 'QueryDocumentsHttpResolver', {
      dataSourceName: httpDataSource.dataSourceName,
      apiId: graphQlApi.graphQlApiApiId,
      fieldName: 'todos',
      typeName: 'Query',
      requestMappingTemplate: `{
        "version": "2018-05-29",
        "method": "GET",
        "resourcePath": "/prod/todos",
        "params":{
          "query": {
              "done": "$util.defaultIfNull($ctx.args.filter.done, 'null')",
              "description": "$util.defaultIfNullOrEmpty($ctx.args.filter.description, '')"
            },
            "headers": $util.toJson($utils.http.copyHeaders($ctx.request.headers))
        }
      }`,
      responseMappingTemplate: `
    #if($ctx.error)
      $util.error($ctx.error.message, $ctx.error.type)
    #end
    #if($ctx.result.statusCode == 200)
      $ctx.result.body
    #else
      $utils.appendError($ctx.result.body, $ctx.result.statusCode)
    #end`,
    });
  }
};
