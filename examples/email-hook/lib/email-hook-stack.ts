import cdk = require("@aws-cdk/cdk");
import { CfnReceiptRuleSet, CfnReceiptRule } from "@aws-cdk/aws-ses";
import { CdkActivateSesRuleSet } from "cdk-activate-ses-rule-set";
import s3 = require("@aws-cdk/aws-s3");

interface EmailHookStackProps {
  bucketRef: s3.BucketRefProps;
  emails: string[];
}

export class EmailHookStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: EmailHookStackProps) {
    super(parent, name);

    const bucket = s3.Bucket.import(this, "EmailBucket", props.bucketRef);
    const inboundRuleSet = new CfnReceiptRuleSet(this, `InboundRuleSet`);

    props.emails.forEach(email => {
      this.inboundEmailAddress(email, inboundRuleSet, bucket);
    });

    new CdkActivateSesRuleSet(this, "ActivateSesRuleSet", {
      inboundRuleSet
    });
  }

  inboundEmailAddress(
    emailAddress: string,
    inboundRuleSet: CfnReceiptRuleSet,
    bucket: s3.BucketRef
  ): void {
    const name = emailAddress.split("@")[0].replace("-", "");
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
        recipients: [emailAddress],
        scanEnabled: true
      },
      ruleSetName: inboundRuleSet.receiptRuleSetName
    });
  }
}
