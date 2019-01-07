# AppSync

## DataSources and Resolvers

### HTTP

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
        'https://xrtbumqy1m.execute-api.eu-central-1.amazonaws.com',
    },
  }
);

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