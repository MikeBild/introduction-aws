const { join } = require('path');
const { Stack, Output } = require('@aws-cdk/cdk');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { PolicyStatement } = require('@aws-cdk/aws-iam');
const {
  LambdaRestApi,
  EndpointType,
  CfnDomainName,
  CfnBasePathMapping,
} = require('@aws-cdk/aws-apigateway');
const { Certificate } = require('@aws-cdk/aws-certificatemanager');

module.exports = class WebApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const domainName = `${props.hostName}.${props.domainName}`;

    const lambda = new Function(this, 'todo-app', {
      functionName: 'todo-app',
      runtime: Runtime.NodeJS810,
      handler: 'server.handler',
      code: Code.asset(join(__dirname, '../build')),
      environment: {
        API_URL: props.apiUrl,
      },
    });

    const policy = new PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource('*');
    lambda.role.addToPolicy(policy);

    const api = new LambdaRestApi(this, 'todo-app-api', {
      handler: lambda,
      proxy: true,
      options: {
        deploy: true,
        endpointTypes: [EndpointType.Regional],
      },
    });

    this.appUrl = new Output(this, 'AppUrl', {
      value: api.url,
    })
      .makeImportValue()
      .toString();

    /*
    Attention: Manual confirmation by email!
    */
    const certificate = new Certificate(this, 'TodoWebAppCertificate', {
      domainName,
    });

    const domainname = new CfnDomainName(this, 'TodoWebAppDomainName', {
      domainName,
      endpointConfiguration: {
        types: ['REGIONAL'],
      },
      regionalCertificateArn: certificate.certificateArn,
    });

    new CfnBasePathMapping(this, 'TodoAppBasePathMapping', {
      domainName: domainname.domainNameName,
      stage: props.stageName,
      restApiId: api.restApiId,
    });

    this.domainNameRegionalDomainName = new Output(
      this,
      'DomainNameRegionalDomainName',
      {
        value: domainname.domainNameRegionalDomainName,
      }
    )
      .makeImportValue()
      .toString();

    this.domainNameRegionalHostedZoneId = new Output(
      this,
      'DomainNameRegionalHostedZoneId',
      {
        value: domainname.domainNameRegionalHostedZoneId,
      }
    )
      .makeImportValue()
      .toString();

    this.domainNameName = new Output(this, 'DomainNameName', {
      value: domainname.domainNameName,
    })
      .makeImportValue()
      .toString();
  }
};
