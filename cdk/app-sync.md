# AppSync GraphQL Server

1. GraphQL-API
2. API-Key
3. Schema
4. DataSources
    * Lambda
    * HTTP
    * DynamoDB
5. Resolvers

## API

```javascript
// GraphQL-API construction
const graphQlApi = new CfnGraphQLApi(this, 'GraphQLApi', {
  name               : 'GraphQLApi',
  authenticationType : 'API_KEY',
  logConfig          : {
    cloudWatchLogsRoleArn : logsServiceRole.roleArn,
    fieldLogLevel         : 'ALL',
  },
});

// Export the generated GraphQL-API-URL
this.graphQlApiUrl = new Output(this, 'GraphQlApiUrl', {
  value : graphQlApi.graphQlApiGraphQlUrl,
})
  .makeImportValue()
  .toString();
```

## API-Key

```javascript
// API-Key construction
const apiKey = new CfnApiKey(this, 'ApiKey', {
  apiId : graphQlApi.graphQlApiApiId,
});

// Export the generated GraphQL-API-Key
this.graphQlApiKey = new Output(this, 'GraphQlApiKey', {
  value : apiKey.apiKey,
})
  .makeImportValue()
  .toString();
```

## GraphQL Schema

```javascript
// GraphQL-Schema construction
new CfnGraphQLSchema(this, 'GraphQLApiSchema', {
  apiId      : graphQlApi.graphQlApiApiId,
  definition : readFileSync(join(__dirname, 'schema.graphql')).toString(),
});
```

## DataSources

### Lambda-DataSource

```javascript
const lambdaDataSource = new CfnDataSource(this, 'LambdaDataSource', {
    name           : 'LambdaDataSource',
    type           : 'AWS_LAMBDA',
    apiId          : graphQlApi.graphQlApiApiId,
    lambdaConfig   : {
      lambdaFunctionArn : lambda.functionArn,
    },
    serviceRoleArn : lambdaServiceRole.roleArn,
  });
```

### HTTP-DataSource

```javascript
const {
  CfnDataSource,
  CfnResolver,
} = require('@aws-cdk/aws-appsync')

const httpDataSource = new CfnDataSource(
  this,
  'HttpDataSource',
  {
    name       : 'HttpDataSource',
    type       : 'HTTP',
    apiId      : graphQlApi.graphQlApiApiId,
    httpConfig : {
      endpoint :
        'https://...',
    },
  }
);
```

## Resolvers

### Lambda-Resolver

```javascript
// Lambda resolver construction
new CfnResolver(this, 'ChangeResolver', {
  dataSourceName          : change.dataSourceName,
  apiId                   : graphQlApi.graphQlApiApiId,
  fieldName               : 'articleChange',
  typeName                : 'Mutation',
  requestMappingTemplate  : `{
    "version" : "2017-02-28",
    "operation": "Invoke",
    "payload": $util.toJson($context.arguments)
  }`,
  responseMappingTemplate : `$util.toJson($context.result)`,
});
```

### HTTP-Resolver

```javascript
// HTTP resolver construction
new CfnResolver(this, 'QueryDocumentsHttpResolver', {
  dataSourceName          : httpDataSource.dataSourceName,
  apiId                   : graphQlApi.graphQlApiApiId,
  fieldName               : 'documents',
  typeName                : 'Query',
  requestMappingTemplate  : `{
    "version": "2018-05-29",
    "method": "GET",
    "resourcePath": "/prod/documents"
  }`,
  responseMappingTemplate : `
  #if($ctx.error)
    $util.error($ctx.error.message, $ctx.error.type)
  #end
  #if($ctx.result.statusCode == 200)
    $ctx.result.body
  #else
    $utils.appendError($ctx.result.body, $ctx.result.statusCode)
  #end`,
});
```