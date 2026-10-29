const { Stack } = require('@aws-cdk/cdk');
const { Table, BillingMode, AttributeType } = require('@aws-cdk/aws-dynamodb');

module.exports = class CMSUserProfile extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    new Table(this, 'CMSUserProfiles', {
      partitionKey : { name: 'id', type: AttributeType.String },
      billingMode  : BillingMode.PayPerRequest,
      tableName    : 'UserProfiles',
    });
  }
};
