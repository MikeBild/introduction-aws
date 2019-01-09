const { join } = require('path');
const { Stack } = require('@aws-cdk/cdk');
const { CfnDataSource, CfnResolver } = require('@aws-cdk/aws-appsync');

module.exports = class UserProfileListResolver extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const { graphQlApi, dynamoDBServiceRole } = props;

    const articlesList = new CfnDataSource(this, 'UserProfilesDataSource', {
      name           : 'UserProfiles',
      type           : 'AMAZON_DYNAMODB',
      apiId          : graphQlApi.graphQlApiApiId,
      dynamoDbConfig : { tableName: 'UserProfiles', awsRegion: 'eu-central-1' },
      serviceRoleArn : dynamoDBServiceRole.roleArn,
    });

    new CfnResolver(this, 'UserProfileListResolver', {
      dataSourceName          : articlesList.dataSourceName,
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
