const { Stack } = require('@aws-cdk/cdk');
const { CfnDataSource, CfnResolver } = require('@aws-cdk/aws-appsync');

module.exports = class UserProfileGetResolver extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const { graphQlApi, userProfilesDataSource } = props;

    new CfnResolver(this, 'UserProfileGetResolver', {
      dataSourceName          : userProfilesDataSource.dataSourceName,
      apiId                   : graphQlApi.graphQlApiApiId,
      fieldName               : 'userProfile',
      typeName                : 'Article',
      requestMappingTemplate  : `{
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
            "id": $util.dynamodb.toDynamoDBJson($ctx.source.name),
        }
      }`,
      responseMappingTemplate : `$util.toJson($ctx.result)`,
    });
  }
};
