#!/usr/bin/env node
import cdk = require("@aws-cdk/cdk");
import { EmailHookStack } from "../lib/email-hook-stack";

const app = new cdk.App();
new EmailHookStack(app, "EmailHookStack");
app.run();
