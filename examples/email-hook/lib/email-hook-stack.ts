import cdk = require("@aws-cdk/cdk");
import { CfnReceiptRuleSet } from "@aws-cdk/aws-ses";
import { CdkActivateSesRuleSet } from "cdk-activate-ses-rule-set";

export class EmailHookStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const inboundRuleSet = new CfnReceiptRuleSet(this, `InboundRuleSet`);

    new CdkActivateSesRuleSet(this, "ActivateSesRuleSet", {
      inboundRuleSet
    });
  }
}
