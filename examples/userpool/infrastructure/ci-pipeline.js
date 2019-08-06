const {
  PipelineProject,
  LinuxBuildImage,
  PipelineBuildAction,
} = require('@aws-cdk/aws-codebuild');
const { Pipeline, GitHubSourceAction } = require('@aws-cdk/aws-codepipeline');
const { PolicyStatement } = require('@aws-cdk/aws-iam');
const { Stack, SecretParameter } = require('@aws-cdk/cdk');

module.exports = class UserPoolCIPipeline extends Stack {
  constructor(parent, name, props) {
    super(parent, name, props);

    const pipeline = new Pipeline(this, 'UserPoolCIPipeline', {
      pipelineName: 'userpool-ci-pipeline',
    });

    const githubAccessToken = new SecretParameter(this, 'UserPoolGitHubToken', {
      ssmParameter: 'GitHubCodePipelineAccessToken',
    });

    const source = new GitHubSourceAction(this, 'UserPoolCIGitHubSource', {
      stage: pipeline.addStage('Source'),
      owner: 'MikeBild',
      repo: 'introduction-aws',
      branch: 'master',
      oauthToken: githubAccessToken.value,
    });

    const buildStage = pipeline.addStage('Deploy');
    const project = new PipelineProject(this, 'UserPoolCIBuild', {
      buildSpec: 'examples/userpool/buildspec.yml',
      environment: {
        buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
      },
    });

    new PipelineBuildAction(this, 'UserPoolCIDeployment', {
      stage: buildStage,
      project,
      inputArtifact: source.outputArtifact,
    });

    project.addToRolePolicy(
      new PolicyStatement().addActions('*').addResource('*')
    );
  }
};
