import cdk = require("@aws-cdk/cdk");
import s3 = require("@aws-cdk/aws-s3");
import { PolicyStatement, PolicyStatementEffect } from "@aws-cdk/aws-iam";

export class EmailBucketStack extends cdk.Stack {
  public readonly bucketRef: s3.BucketRefProps;

  constructor(
    parent: cdk.App,
    name: string,
    bucketName: string,
    props?: cdk.StackProps
  ) {
    super(parent, name, props);

    const bucket = new s3.Bucket(this, bucketName, {
      removalPolicy: cdk.RemovalPolicy.Orphan
    });

    const bucketPolicy = new PolicyStatement(PolicyStatementEffect.Allow)
      .addServicePrincipal("ses.amazonaws.com")
      .addAction("s3:PutObject")
      .addResource(bucket.arnForObjects("*"))
      .addCondition("StringEquals", {
        "aws:Referer": new cdk.AwsAccountId()
      });

    bucket.addToResourcePolicy(bucketPolicy);

    this.bucketRef = bucket.export();
  }
}
