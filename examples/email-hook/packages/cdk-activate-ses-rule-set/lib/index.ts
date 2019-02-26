import cdk = require("@aws-cdk/cdk");
import lambda = require("@aws-cdk/aws-lambda");
import { CfnReceiptRuleSet } from "@aws-cdk/aws-ses";
import { CustomResource } from "@aws-cdk/aws-cloudformation";
import { PolicyStatement, PolicyStatementEffect } from "@aws-cdk/aws-iam";
import path = require("path");

export interface CdkActivateSesRuleSetProps {
  inboundRuleSet: CfnReceiptRuleSet;
}

export class CdkActivateSesRuleSet extends cdk.Construct {
  constructor(
    parent: cdk.Construct,
    name: string,
    props: CdkActivateSesRuleSetProps
  ) {
    super(parent, name);

    const handler = new lambda.Function(this, "ActivateRuleSetLambda", {
      runtime: lambda.Runtime.NodeJS810,
      // lambda.Code.asset resolves from cwd() by default
      code: lambda.Code.asset(
        path.dirname(require.resolve("../resources/activate-rule-set"))
      ),
      handler: "index.main"
    });

    handler.addToRolePolicy(
      new PolicyStatement(PolicyStatementEffect.Allow)
        .addActions(
          "ses:SetActiveReceiptRuleSet",
          "ses:DescribeActiveReceiptRuleSet"
        )
        .addResource("*")
    );

    new CustomResource(this, "ActivateRuleSet", {
      resourceType: "Custom::ActivateSESRuleSet",
      lambdaProvider: handler,
      properties: {
        ruleSetRef: props.inboundRuleSet.ref
      }
    });
  }
}
