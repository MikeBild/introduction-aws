const { join } = require('path');
const { Stack } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { CfnDataSource, CfnResolver } = require('@aws-cdk/aws-appsync');

module.exports = class PreviewResolvers extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const { lambdaServiceRole, graphQlApi, previewWebSitesBucket } = props;

    const lambda = new Function(this, 'PreviewGet', {
      runtime     : Runtime.NodeJS810,
      handler     : 'previews.get',
      code        : Code.asset(join(__dirname, '../../build')),
      environment : { bucketName: previewWebSitesBucket.bucketName },
    });
    previewWebSitesBucket.grantReadWrite(lambda.role);

    const previewGet = new CfnDataSource(this, 'PreviewGetDataSource', {
      name           : 'PreviewGet',
      type           : 'AWS_LAMBDA',
      apiId          : graphQlApi.graphQlApiApiId,
      lambdaConfig   : {
        lambdaFunctionArn : lambda.functionArn,
      },
      serviceRoleArn : lambdaServiceRole.roleArn,
    });

    new CfnResolver(this, 'ArticlePreviewResolver', {
      dataSourceName          : previewGet.dataSourceName,
      apiId                   : graphQlApi.graphQlApiApiId,
      fieldName               : 'preview',
      typeName                : 'Article',
      requestMappingTemplate  : `{
        "version" : "2017-02-28",
        "operation": "Invoke",
        "payload": $util.toJson($ctx.source)
      }`,
      responseMappingTemplate : `$util.toJson($ctx.result)`,
    });
  }
};
