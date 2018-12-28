#!/usr/bin/env node
import cdk = require("@aws-cdk/cdk");
import { EmailBucketStack } from "../lib/email-bucket-stack";
import { EmailHookStack } from "../lib/email-hook-stack";

const app = new cdk.App();

const emailBucketStack = new EmailBucketStack(
  app,
  "EmailBucketStack",
  "inbound-emails"
);

new EmailHookStack(app, "EmailHookStack", {
  bucketRef: emailBucketStack.bucketRef,
  emails: ["foo@example.org"]
});

app.run();
