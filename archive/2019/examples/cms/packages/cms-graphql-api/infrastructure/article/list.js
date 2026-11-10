const { join } = require('path');
const { Stack } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { CfnDataSource, CfnResolver } = require('@aws-cdk/aws-appsync');

module.exports = class ArticleListResolver extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const { lambdaServiceRole, graphQlApi, catalogBucket } = props;

    const lambda = new Function(this, 'ArticlesList', {
      runtime     : Runtime.NodeJS810,
      handler     : 'articles.list',
      code        : Code.asset(join(__dirname, '../../build')),
      environment : { bucketName: catalogBucket.bucketName },
    });
    catalogBucket.grantReadWrite(lambda.role);

    const articlesList = new CfnDataSource(this, 'ArticlesListDataSource', {
      name           : 'ArticlesList',
      type           : 'AWS_LAMBDA',
      apiId          : graphQlApi.graphQlApiApiId,
      lambdaConfig   : {
        lambdaFunctionArn : lambda.functionArn,
      },
      serviceRoleArn : lambdaServiceRole.roleArn,
    });

    new CfnResolver(this, 'QueryArticlesResolver', {
      dataSourceName          : articlesList.dataSourceName,
      apiId                   : graphQlApi.graphQlApiApiId,
      fieldName               : 'articles',
      typeName                : 'Query',
      requestMappingTemplate  : `{
        "version" : "2017-02-28",
        "operation": "Invoke",
        "payload": $util.toJson($ctx.arguments)
      }`,
      responseMappingTemplate : `$util.toJson($ctx.result)`,
    });
  }
};
