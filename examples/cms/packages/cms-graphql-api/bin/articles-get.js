const { join } = require('path');
const { Stack } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { CfnDataSource, CfnResolver } = require('@aws-cdk/aws-appsync');

module.exports = class ArticlesResolvers extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const { lambdaServiceRole, graphQlApi, cmsBucket } = props;

    const lambda = new Function(this, 'ArticlesGet', {
      runtime     : Runtime.NodeJS810,
      handler     : 'articles.get',
      code        : Code.asset(join(__dirname, '../build')),
      environment : { bucketName: cmsBucket.bucketName },
    });
    cmsBucket.grantReadWrite(lambda.role);

    const articlesGet = new CfnDataSource(this, 'ArticlesGetDataSource', {
      name           : 'ArticlesGet',
      type           : 'AWS_LAMBDA',
      apiId          : graphQlApi.graphQlApiApiId,
      lambdaConfig   : {
        lambdaFunctionArn : lambda.functionArn,
      },
      serviceRoleArn : lambdaServiceRole.roleArn,
    });

    new CfnResolver(this, 'QueryArticleResolver', {
      dataSourceName          : articlesGet.dataSourceName,
      apiId                   : graphQlApi.graphQlApiApiId,
      fieldName               : 'article',
      typeName                : 'Query',
      requestMappingTemplate  : `{
        "version" : "2017-02-28",
        "operation": "Invoke",
        "payload": $util.toJson($context.arguments)
      }`,
      responseMappingTemplate : `$util.toJson($context.result)`,
    });

    new CfnResolver(this, 'DocumentArticleResolver', {
      dataSourceName          : articlesGet.dataSourceName,
      apiId                   : graphQlApi.graphQlApiApiId,
      fieldName               : 'article',
      typeName                : 'Document',
      requestMappingTemplate  : `{
        "version" : "2017-02-28",
        "operation": "Invoke",
        "payload": $util.toJson($context.source)
      }`,
      responseMappingTemplate : `$util.toJson($context.result)`,
    });
  }
};
