#!/usr/bin/env node
import codebuild = require("@aws-cdk/aws-codebuild");
import codepipeline = require("@aws-cdk/aws-codepipeline");
import iam = require("@aws-cdk/aws-iam");
import cdk = require("@aws-cdk/cdk");

class EmailHookPipeline extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const pipeline = new codepipeline.Pipeline(this, "Pipeline", {
      pipelineName: "email-hook-pipeline"
    });

    // Source
    const githubAccessToken = new cdk.SecretParameter(this, "GitHubToken", {
      ssmParameter: "/CDK/GitHubToken"
    });

    const source = new codepipeline.GitHubSourceAction(this, "GitHubSource", {
      stage: pipeline.addStage("Source"),
      owner: "skorfmann",
      repo: "introduction-aws",
      branch: "email-hook-pipeline",
      oauthToken: githubAccessToken.value
    });

    // Build

    const buildStage = pipeline.addStage("Deploy");
    const project = new codebuild.PipelineProject(this, "EmailHook", {
      buildSpec: "examples/email-hook/buildspec.yml",
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0
      }
    });

    new codebuild.PipelineBuildAction(this, "EmailHookDeployment", {
      stage: buildStage,
      project,
      inputArtifact: source.outputArtifact
    });

    // This should be reduced to the actual necessary permissions
    project.addToRolePolicy(
      new iam.PolicyStatement().addActions("*").addResource("*")
    );
  }
}

const app = new cdk.App();
new EmailHookPipeline(app, "EmailHookPipeline");
app.run();