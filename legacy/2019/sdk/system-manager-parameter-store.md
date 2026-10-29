# System-Manager / Parameter Store

[Parameter Store](https://eu-central-1.console.aws.amazon.com/systems-manager/parameters) configurable parameters plain/encrypted into a key-value store.

```javascript
const { SSM } = require('aws-sdk');
const ssm = new SSM({ region: 'eu-central-1' });

const {
  Parameter: { Value },
} = await ssm.getParameter({ Name: 'APIToken' }).promise();
```
