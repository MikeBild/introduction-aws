const { join } = require('path');
const { Stack } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { CfnDataSource, CfnResolver } = require('@aws-cdk/aws-appsync');

module.exports = class ArticlesResolvers extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const { lambdaServiceRole, graphQlApi, catalogBucket } = props;

    const lambda = new Function(this, 'ArticlesAdd', {
      runtime     : Runtime.NodeJS810,
      handler     : 'articles.add',
      code        : Code.asset(join(__dirname, '../build')),
      environment : { bucketName: catalogBucket.bucketName },
    });
    catalogBucket.grantReadWrite(lambda.role);

    const articlesAdd = new CfnDataSource(this, 'ArticlesAddDataSource', {
      name           : 'ArticlesAdd',
      type           : 'AWS_LAMBDA',
      apiId          : graphQlApi.graphQlApiApiId,
      lambdaConfig   : {
        lambdaFunctionArn : lambda.functionArn,
      },
      serviceRoleArn : lambdaServiceRole.roleArn,
    });

    new CfnResolver(this, 'ArticlesAddResolver', {
      dataSourceName          : articlesAdd.dataSourceName,
      apiId                   : graphQlApi.graphQlApiApiId,
      fieldName               : 'articleAdd',
      typeName                : 'Mutation',
      requestMappingTemplate  : `{
        "version" : "2017-02-28",
        "operation": "Invoke",
        "payload": $util.toJson($context.arguments)
      }`,
      responseMappingTemplate : `$util.toJson($context.result)`,
    });
  }
};
