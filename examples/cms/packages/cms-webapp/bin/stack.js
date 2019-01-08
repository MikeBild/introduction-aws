const { join } = require('path');
const { Stack } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi, EndpointType } = require('@aws-cdk/aws-apigateway');

module.exports = class CMSWebApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const lambda = new Function(this, 'cms-webapp', {
      functionName : 'cms-webapp',
      runtime      : Runtime.NodeJS810,
      handler      : 'server.handler',
      code         : Code.asset(join(__dirname, '../build')),
      environment  : {
        GRAPHQL_APIKEY : props.graphQlApiKey,
        GRAPHQL_URL    : props.graphQlApiUrl,
      },
    });

    const api = new LambdaRestApi(this, 'cms-webapp-api', {
      handler : lambda,
      proxy   : true,
      options : {
        deploy        : true,
        endpointTypes : [
          EndpointType.Regional,
        ],
      },
    });
  }
};
