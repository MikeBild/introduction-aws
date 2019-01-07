import cdk = require("@aws-cdk/cdk");
import sns = require("@aws-cdk/aws-sns");
import lambda = require("@aws-cdk/aws-lambda");
import { SnsEventSource } from "@aws-cdk/aws-lambda-event-sources";
import iam = require("@aws-cdk/aws-iam");
import dynamodb = require("@aws-cdk/aws-dynamodb");
import path = require("path");

interface ScraperStackProps {
  topic: sns.TopicRefProps;
}

export class ScraperStack extends cdk.Stack {
  public readonly propertiesTableStreamArn: string;

  constructor(parent: cdk.App, name: string, props: ScraperStackProps) {
    super(parent, name);

    const topicRef = sns.TopicRef.import(this, "NewUrlTopic", props.topic);

    const lambdaDir = path.dirname(require.resolve("../resources/scraper"));

    const scrapeResults = new dynamodb.Table(this, "ScrapeResults", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.String
      },
      billingMode: dynamodb.BillingMode.PayPerRequest,
      streamSpecification: dynamodb.StreamViewType.NewImage
    });

    const scraper = new lambda.Function(this, "Scraper", {
      runtime: lambda.Runtime.NodeJS810,
      environment: {
        DDB_TABLE: scrapeResults.tableName
      },
      code: lambda.Code.asset(lambdaDir),
      handler: "index.main",
      timeout: 45,
      memorySize: 1536
    });

    // reservedConcurrentExecutions isn't exposed on the higher level interface yet
    // Purpose: Reuse warm function which is three times faster than a Chrome cold start
    const scraperResource = scraper.findChild("Resource") as lambda.CfnFunction;
    scraperResource.propertyOverrides.reservedConcurrentExecutions = 1;

    scraper.addEventSource(new SnsEventSource(topicRef));
    scrapeResults.grantWriteData(scraper.role);

    const cloudinaryCloudName = new cdk.SecretParameter(
      this,
      "CloudinaryCloudName",
      {
        ssmParameter: "/CDK/CloudinaryCloudName"
      }
    );

    const cloudinaryApiKey = new cdk.SecretParameter(this, "CloudinaryApiKey", {
      ssmParameter: "/CDK/CloudinaryApiKey"
    });

    const cloudinaryApiSecret = new cdk.SecretParameter(
      this,
      "CloudinaryApiSecret",
      {
        ssmParameter: "/CDK/CloudinaryApiSecret"
      }
    );

    const otherLambdaDir = path.dirname(
      require.resolve("../resources/process-images")
    );

    const algoliaApplicationId = new cdk.SecretParameter(
      this,
      "AlgoliaApplicationId",
      {
        ssmParameter: "/CDK/AlgoliaApplicationId"
      }
    );
    const algoliaApiKey = new cdk.SecretParameter(this, "AlgoliaApiKey", {
      ssmParameter: "/CDK/AlgoliaApiKey"
    });

    const processImages = new lambda.Function(this, "processImages", {
      runtime: lambda.Runtime.NodeJS810,
      environment: {
        CLOUDINARY_CLOUD_NAME: cloudinaryCloudName.value,
        CLOUDINARY_API_KEY: cloudinaryApiKey.value,
        CLOUDINARY_API_SECRET: cloudinaryApiSecret.value,
        ALGOLIA_APPLICATION_ID: algoliaApplicationId.value,
        ALGOLIA_API_KEY: algoliaApiKey.value,
        ALGOLIA_INDEX_NAME: "properties"
      },
      code: lambda.Code.asset(otherLambdaDir),
      handler: "index.main"
    });

    new lambda.EventSourceMapping(this, "Foo", {
      eventSourceArn: scrapeResults.tableStreamArn,
      target: processImages,
      startingPosition: lambda.StartingPosition.TrimHorizon
    });

    processImages.addToRolePolicy(
      new iam.PolicyStatement()
        .addActions(
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams"
        )
        .addResource(scrapeResults.tableStreamArn)
    );

    this.propertiesTableStreamArn = scrapeResults.tableStreamArn;
  }
}
