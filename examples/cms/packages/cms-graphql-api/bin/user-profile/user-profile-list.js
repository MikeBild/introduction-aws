const { Stack } = require('@aws-cdk/cdk');
const { CfnDataSource, CfnResolver } = require('@aws-cdk/aws-appsync');

module.exports = class UserProfileListResolver extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const { graphQlApi, userProfilesDataSource } = props;

    new CfnResolver(this, 'UserProfileListResolver', {
      dataSourceName          : userProfilesDataSource.dataSourceName,
      apiId                   : graphQlApi.graphQlApiApiId,
      fieldName               : 'userProfiles',
      typeName                : 'Query',
      requestMappingTemplate  : `{
        "version" : "2017-02-28",
        "operation" : "Scan",
      }`,
      responseMappingTemplate : `$util.toJson($ctx.result.items)`,
    });
  }
};
