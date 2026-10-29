const { Stack, Output } = require('@aws-cdk/cdk');
const { HostedZoneProvider, AliasRecord } = require('@aws-cdk/aws-route53');

module.exports = class TodoAppAlias extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const {
      domainNameRegionalHostedZoneId,
      domainNameRegionalDomainName,
      hostName,
      domainName,
    } = props;

    const zone = new HostedZoneProvider(this, {
      domainName,
    }).findAndImport(this, domainName);

    const alias = new AliasRecord(this, 'TodoAppDNSAlias', {
      zone,
      recordName: `${hostName}.${domainName}`,
      target: {
        asAliasRecordTarget() {
          return {
            hostedZoneId: domainNameRegionalHostedZoneId,
            dnsName: domainNameRegionalDomainName,
          };
        },
      },
    });

    this.alias = new Output(this, 'DNSAlias', {
      value: `https://${hostName}.${domainName}`,
    })
      .makeImportValue()
      .toString();
  }
};
