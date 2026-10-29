const { Stack, Output } = require('@aws-cdk/cdk');
const { HostedZoneProvider, AliasRecord } = require('@aws-cdk/aws-route53');

module.exports = class CMSWebAppAlias extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);
    const {
      domainNameRegionalHostedZoneId,
      domainNameRegionalDomainName,
    } = props;

    const zone = new HostedZoneProvider(this, {
      domainName : props.domainName,
    }).findAndImport(this, props.domainName);

    const alias = new AliasRecord(zone, 'CMSWebAppDNSAlias', {
      recordName : `${props.hostName}.${props.domainName}`,
      target     : {
        asAliasRecordTarget() {
          return {
            hostedZoneId : domainNameRegionalHostedZoneId,
            dnsName      : domainNameRegionalDomainName,
          };
        },
      },
    });

    this.alias = new Output(this, 'DNSAlias', {
      value : `https://${props.hostName}.${props.domainName}`,
    })
      .makeImportValue()
      .toString();
  }
};
