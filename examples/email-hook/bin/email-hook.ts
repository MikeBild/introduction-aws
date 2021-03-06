#!/usr/bin/env node
import cdk = require("@aws-cdk/cdk");
import { EmailHookStack } from "../lib/email-hook-stack";

const app = new cdk.App();

new EmailHookStack(app, "EmailHookStack", {
  bucketName: "inbound-emails",
  emails: ["foo@example.org"]
});

app.run();
