const { join } = require('path');
const { Stack, RemovalPolicy } = require('@aws-cdk/cdk');
const { Bucket } = require('@aws-cdk/aws-s3');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi, EndpointType } = require('@aws-cdk/aws-apigateway');
const { Role, ServicePrincipal, PolicyStatement } = require('@aws-cdk/aws-iam');
const { CfnCrawler } = require('@aws-cdk/aws-glue');

module.exports = class WebApp extends Stack {
  constructor(parent, id, props) {
    super(parent, id, props);

    const lambda = new Function(this, 'todo-api-function', {
      functionName : 'todo-api',
      runtime      : Runtime.NodeJS810,
      handler      : 'server.handler',
      code         : Code.asset(join(__dirname, '../build')),
    });

    const todosBucket = new Bucket(this, 'todo-app-todos', {
      bucketName     : 'todo-app-todos',
      removalPolicy  : RemovalPolicy.Destroy,
      retainOnDelete : false,
    });
    todosBucket.grantReadWrite(lambda.role);

    const policy = new PolicyStatement()
      .addAction('lambda:InvokeFunction')
      .addResource('*');
    lambda.role.addToPolicy(policy);

    const api = new LambdaRestApi(this, 'todo-api', {
      handler : lambda,
      proxy   : true,
      options : {
        deploy        : true,
        endpointTypes : [
          EndpointType.Regional,
        ],
      },
    });

    const glueRole = new Role(this, 'AWSGlueServiceRole', {
      assumedBy         : new ServicePrincipal('glue.amazonaws.com'),
      managedPolicyArns : [
        'arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole',
      ],
    });

    todosBucket.grantReadWrite(glueRole);

    new CfnCrawler(this, 'TodosCrawler', {
      databaseName       : 'todo-app',
      name               : 'TodosCrawler',
      role               : glueRole.roleName,
      targets            : {
        s3Targets : [
          { path: todosBucket.path },
        ],
      },
      schemaChangePolicy : {
        deleteBehavior : 'DEPRECATE_IN_DATABASE',
        updateBehavior : 'UPDATE_IN_DATABASE',
      },
      schedule           : { scheduleExpression: 'cron(0/5 * * * ? *)' },
    });
  }
};
