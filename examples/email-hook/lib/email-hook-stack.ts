import cdk = require("@aws-cdk/cdk");
import { CfnReceiptRuleSet } from "@aws-cdk/aws-ses";
import s3 = require("@aws-cdk/aws-s3");
import sns = require("@aws-cdk/aws-sns");
import { CdkSesToS3 } from "cdk-ses-to-s3";
import { CdkActivateSesRuleSet } from "cdk-activate-ses-rule-set";
import { CdkExtractLinks } from "cdk-extract-links";

interface EmailHookStackProps {
  bucketName: string;
  emails: string[];
}

export class EmailHookStack extends cdk.Stack {
  public readonly bucket: s3.BucketRefProps;
  public readonly topic: sns.TopicRefProps;

  constructor(parent: cdk.App, name: string, props: EmailHookStackProps) {
    super(parent, name);

    const bucket = new s3.Bucket(this, props.bucketName, {
      removalPolicy: cdk.RemovalPolicy.Orphan
    });

    const newUrlTopic = new sns.Topic(this, "NewUrlTopic", {
      displayName: "New Url Topic"
    });

    const inboundRuleSet = new CfnReceiptRuleSet(this, `InboundRuleSet`);

    new CdkSesToS3(this, "inbound-emails-to-s3", {
      emails: props.emails,
      inboundRuleSet: inboundRuleSet,
      bucket: bucket
    });

    new CdkExtractLinks(this, "extract-links", {
      bucket: bucket,
      topic: newUrlTopic,
      extractLinks: function(email) {
        email;
      }
    });

    new CdkActivateSesRuleSet(this, "activate-rule-set", {
      inboundRuleSet: inboundRuleSet
    });

    this.bucket = bucket.export();
    this.topic = newUrlTopic.export();
  }
}
