const { join } = require('path');
const { Function } = require('@aws-cdk/aws-lambda');
const { Stack } = require('@aws-cdk/cdk');
const { CfnDataSource, CfnResolver } = require('@aws-cdk/aws-appsync');

module.exports = class ArticlesResolvers extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const {
      lambdaServiceRole,
      graphQlApi,
      catalogBucket,
      generatePreviewWebsiteFunction,
    } = props;

    const lambda = Function.import(this, 'ArticlesPreview', {
      functionArn : generatePreviewWebsiteFunction.functionArn,
    });
    catalogBucket.grantReadWrite(lambda.role);

    const articlesPreview = new CfnDataSource(
      this,
      'ArticlesPreviewDataSource',
      {
        name           : 'ArticlesPreview',
        type           : 'AWS_LAMBDA',
        apiId          : graphQlApi.graphQlApiApiId,
        lambdaConfig   : {
          lambdaFunctionArn : lambda.functionArn,
        },
        serviceRoleArn : lambdaServiceRole.roleArn,
      }
    );

    new CfnResolver(this, 'ArticlesPreviewResolver', {
      dataSourceName          : articlesPreview.dataSourceName,
      apiId                   : graphQlApi.graphQlApiApiId,
      fieldName               : 'articlePreview',
      typeName                : 'Mutation',
      requestMappingTemplate  : `{
        "version" : "2017-02-28",
        "operation": "Invoke",
        "payload": $util.toJson($ctx.arguments)
      }`,
      responseMappingTemplate : `$util.toJson($ctx.result)`,
    });
  }
};
