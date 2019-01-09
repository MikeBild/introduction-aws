# Route53

## Fundamentals

* Manage DNS Zones and Records

## Setup

```bash
yarn add @aws-cdk/aws-route53 --dev
```

## Example

```javascript
const { HostedZoneProvider, TXTRecord } = require('@aws-cdk/aws-route53');

const zone = new HostedZoneProvider(this, {
  domainName : 'mikebild.com',
}).findAndImport(this, 'mikebild.com');

new TXTRecord(zone, 'TXTRecord', {
  recordName  : 'cms-webapp',
  recordValue :
    'cms-webapp.mikebild.com.s3-website.eu-central-1.amazonaws.com',
  ttl         : 90,
});
```