import cdk = require("@aws-cdk/cdk");
import s3 = require("@aws-cdk/aws-s3");
import { CfnReceiptRuleSet, CfnReceiptRule } from "@aws-cdk/aws-ses";
import { PolicyStatement, PolicyStatementEffect } from "@aws-cdk/aws-iam";

export interface CdkSesToS3Props {
  emails: string[];
  bucket: s3.Bucket;
  inboundRuleSet: CfnReceiptRuleSet;
}

export class CdkSesToS3 extends cdk.Construct {
  constructor(parent: cdk.Construct, name: string, props: CdkSesToS3Props) {
    super(parent, name);

    const { bucket, emails, inboundRuleSet } = props;

    this.grantWriteForSes(bucket);

    emails.forEach(email => {
      this.writeInboundEmailsToS3(email, inboundRuleSet, bucket);
    });
  }

  grantWriteForSes(bucket: s3.Bucket) {
    const bucketPolicy = new PolicyStatement(PolicyStatementEffect.Allow)
      .addServicePrincipal("ses.amazonaws.com")
      .addAction("s3:PutObject")
      .addResource(bucket.arnForObjects("*"))
      .addCondition("StringEquals", {
        "aws:Referer": new cdk.AwsAccountId()
      });

    bucket.addToResourcePolicy(bucketPolicy);
  }

  writeInboundEmailsToS3(
    email: string,
    inboundRuleSet: CfnReceiptRuleSet,
    bucket: s3.Bucket
  ) {
    const name = email.split("@")[0].replace("-", "");
    new CfnReceiptRule(this, `Rule${name}`, {
      rule: {
        actions: [
          {
            s3Action: {
              bucketName: bucket.bucketName,
              objectKeyPrefix: name
            }
          }
        ],
        enabled: true,
        name: name,
        recipients: [email],
        scanEnabled: true
      },
      ruleSetName: inboundRuleSet.receiptRuleSetName
    });
  }
}
