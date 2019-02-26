import cdk = require("@aws-cdk/cdk");
import lambda = require("@aws-cdk/aws-lambda");
import sns = require("@aws-cdk/aws-sns");
import s3 = require("@aws-cdk/aws-s3");
import { S3EventSource } from "@aws-cdk/aws-lambda-event-sources";
import path = require("path");

export interface CdkExtractLinksProps {
  topic: sns.Topic;
  bucket: s3.Bucket;
}

export class CdkExtractLinks extends cdk.Construct {
  constructor(
    parent: cdk.Construct,
    name: string,
    props: CdkExtractLinksProps
  ) {
    super(parent, name);
    const { topic, bucket } = props;

    const s3Hook = new lambda.Function(this, "InboundEmailS3Hook", {
      runtime: lambda.Runtime.NodeJS810,

      code: lambda.Code.asset(
        path.dirname(require.resolve("../resources/inbound-email-s3-hook"))
      ),
      handler: "index.main",
      timeout: 60,
      environment: {
        SNS_TARGET_ARN: topic.topicArn
      }
    });

    s3Hook.addEventSource(
      new S3EventSource(bucket, {
        events: [s3.EventType.ObjectCreated]
      })
    );

    bucket.grantRead(s3Hook.role);
    topic.grantPublish(s3Hook.role);
  }
}
