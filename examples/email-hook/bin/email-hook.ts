#!/usr/bin/env node
import cdk = require("@aws-cdk/cdk");
import { EmailHookStack } from "../lib/email-hook-stack";
import { ScraperStack } from "../lib/scraper-stack";

const app = new cdk.App();

const inboundEmails = new EmailHookStack(app, "EmailHookStack", {
  bucketName: "inbound-emails",
  emails: ["is24@email.webfeed.io"]
});

new ScraperStack(app, "ScraperStack", {
  topic: inboundEmails.topic
});

app.run();
