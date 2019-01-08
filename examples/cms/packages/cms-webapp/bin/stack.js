const { join } = require('path');
const { Stack, Output } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const {
  LambdaRestApi,
  EndpointType,
  CfnDomainName,
  CfnBasePathMapping,
} = require('@aws-cdk/aws-apigateway');
const { Certificate } = require('@aws-cdk/aws-certificatemanager');

module.exports = class CMSWebApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const domainName = `${props.hostName}.${props.domainName}`;

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
        deployOptions : {
          stageName : props.stageName,
        },
        endpointTypes : [
          EndpointType.Regional,
        ],
      },
    });

    /*
    Attention: Manual confirmation by email!
    */
    const certificate = new Certificate(this, 'CMSWebAppCertificate', {
      domainName,
    });

    const domainname = new CfnDomainName(this, 'CMSWebAppDomainName', {
      domainName,
      endpointConfiguration  : {
        types : [
          'REGIONAL',
        ],
      },
      regionalCertificateArn : certificate.certificateArn,
    });

    new CfnBasePathMapping(this, 'CMSWebAppBasePathMapping', {
      domainName : domainname.domainNameName,
      stage      : props.stageName,
      restApiId  : api.restApiId,
    });

    this.domainNameRegionalDomainName = new Output(
      this,
      'DomainNameRegionalDomainName',
      {
        value : domainname.domainNameRegionalDomainName,
      }
    )
      .makeImportValue()
      .toString();

    this.domainNameRegionalHostedZoneId = new Output(
      this,
      'DomainNameRegionalHostedZoneId',
      {
        value : domainname.domainNameRegionalHostedZoneId,
      }
    )
      .makeImportValue()
      .toString();

    this.domainNameName = new Output(this, 'DomainNameName', {
      value : domainname.domainNameName,
    })
      .makeImportValue()
      .toString();
  }
};
