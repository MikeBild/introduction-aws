*English · [Deutsch](README.de.md)*

# Exercises: AWS Serverless

Exercise repository for the workshop “AWS serverless with Lambda, CDK, and DynamoDB”. For each of the 18 lessons you find an exercise here with a starting point, tests and a reference solution. All exercises revolve around the same domain, the workshop shop: products, orders with line items made of `productId`, `quantity` and `priceCents`, money always in whole cents.

## What you learn

- Build and test Lambda handlers, CDK stacks and IAM permissions in TypeScript
- Model DynamoDB by access patterns, up to single-table design
- Decouple workflows with EventBridge, SQS, Step Functions and SES

## Prerequisites

- **Node.js 26** – `nvm use` reads the version from [`.nvmrc`](.nvmrc).
- **AWS CLI v2** and your own sandbox account with admin permissions. Check that you are signed in:

  ```bash
  aws sts get-caller-identity
  ```

You do not need an AWS account for the tests, only for `cdk diff` and `cdk deploy`.

## Setup

1. Clone the repo, install the dependencies, check everything:

   ```bash
   git clone https://github.com/MikeBild/introduction-aws.git
   cd introduction-aws
   npm ci
   npm run check        # tsc, Vitest and cdk synth – without an AWS account
   ```

2. Bootstrap CDK once per account and region:

   ```bash
   npx cdk bootstrap
   ```

## How to work on an exercise

You work in the starting point `start/`: work through the TODO comments, remove the `.skip` in the tests and compare with the reference solution in `solution/` at the end. The section [Layout](#layout) shows how an exercise is structured.

```bash
cd exercises/05-aws-api-gateway-http/start
npx vitest                    # tests in watch mode, without AWS
npx cdk synth                 # generate the template locally
npx cdk diff                  # review the changes against your account
npx cdk deploy                # deploy
npx cdk destroy               # clean up when you are done
```

From the root:

| Command | What it does |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` across all exercises |
| `npm test` | Vitest for all reference solutions |
| `npm run test:start` | Vitest for all starting points (skipped tests count as skipped) |
| `npm run synth` | `cdk synth` for all CDK apps with the placeholder account `123456789012` |
| `npm run synth -- 05` | `cdk synth` for exercise 05 only |
| `npm run check` | all of the above |

The tests need no AWS account. [`aws-sdk-client-mock`](https://github.com/m-radzikowski/aws-sdk-client-mock) replaces SDK calls, and you check stacks with `aws-cdk-lib/assertions`.

## Exercises

| Block | # | Lesson | ID | Exercise |
| --- | --- | --- | --- | --- |
| Day 1 | 01 | What does serverless really take off your plate? | `aws-serverless-mindset` | [exercises/01-aws-serverless-mindset](exercises/01-aws-serverless-mindset) |
| Day 1 | 02 | A Lambda function is just a handler | `aws-lambda-handler` | [exercises/02-aws-lambda-handler](exercises/02-aws-lambda-handler) |
| Day 1 | 03 | Infrastructure belongs as TypeScript in the repo | `aws-cdk-basics` | [exercises/03-aws-cdk-basics](exercises/03-aws-cdk-basics) |
| Day 1 | 04 | Each function gets only its own permissions | `aws-iam-least-privilege` | [exercises/04-aws-iam-least-privilege](exercises/04-aws-iam-least-privilege) |
| Day 1 | 05 | How does an HTTP request reach a function? | `aws-api-gateway-http` | [exercises/05-aws-api-gateway-http](exercises/05-aws-api-gateway-http) |
| Day 1 | 06 | Access patterns first, then the table | `aws-dynamodb-modeling` | [exercises/06-aws-dynamodb-modeling](exercises/06-aws-dynamodb-modeling) |
| Day 1 | 07 | When is single-table design worth it? | `aws-dynamodb-single-table` | [exercises/07-aws-dynamodb-single-table](exercises/07-aws-dynamodb-single-table) |
| Day 1 | 08 | Where should configuration and secrets go? | `aws-config-secrets` | [exercises/08-aws-config-secrets](exercises/08-aws-config-secrets) |
| Day 2 | 14 | Every message can arrive twice | `aws-events-queues` | [exercises/14-aws-events-queues](exercises/14-aws-events-queues) |
| Day 2 | 12 | With SES, the effort is in DNS, not code | `aws-ses-mail` | [exercises/12-aws-ses-mail](exercises/12-aws-ses-mail) |
| Day 2 | 13 | Workflows as state machines, not call chains | `aws-step-functions` | [exercises/13-aws-step-functions](exercises/13-aws-step-functions) |
| Day 2 | 15 | Measure cold starts instead of fearing them | `aws-cold-starts` | [exercises/15-aws-cold-starts](exercises/15-aws-cold-starts) |
| Day 2 | 17 | Practice part one, the order reaches the table | `aws-lab-end-to-end` | [exercises/17-aws-lab-end-to-end](exercises/17-aws-lab-end-to-end) |
| Day 2 | 18 | Hands-on part two, from event to shipping | `aws-lab-fulfillment` | [exercises/18-aws-lab-fulfillment](exercises/18-aws-lab-fulfillment) |

### Additional chapters

| # | Lesson | ID | Exercise |
| --- | --- | --- | --- |
| 09 | Do you still need your own auth server? | `aws-cognito-user-pools` | [exercises/09-aws-cognito-user-pools](exercises/09-aws-cognito-user-pools) |
| 10 | Who checks the token and who checks permissions? | `aws-cognito-authorizer` | [exercises/10-aws-cognito-authorizer](exercises/10-aws-cognito-authorizer) |
| 11 | Does GraphQL still need its own server? | `aws-appsync-graphql` | [exercises/11-aws-appsync-graphql](exercises/11-aws-appsync-graphql) |
| 16 | Without servers, only signals remain | `aws-observability` | [exercises/16-aws-observability](exercises/16-aws-observability) |

The numbers stay stable, the order follows the agenda. The practice lessons 17 and 18 combine exercises 02 to 08 and 12 to 15 into one stack `OrdersStack`. You can catch up on the additional chapters one by one.

Exercises 01 and 06 start with a worksheet instead of code.

## Layout

```text
exercises/
  03-aws-cdk-basics/
    README.md            task, steps, checks
    start/               your starting point with TODO comments
      cdk.json           CDK app: node bin/app.ts (Node 26 runs TypeScript directly)
      bin/app.ts
      lib/*-stack.ts     infrastructure
      src/*.ts           Lambda code
      test/*.test.ts     tests with describe.skip – remove .skip when you start
    solution/            one possible solution, same structure
```

All exercises share one `package.json` and one `node_modules` in the root. Each exercise is still self-contained: you can start with any of them.

## Stack

As of October 2026: Node.js 26 locally · Lambda runtime `nodejs24.x` on ARM · AWS CDK v2 (`aws-cdk-lib` 2.275) · AWS SDK for JavaScript v3 · TypeScript strict as ESM · Vitest · Powertools for AWS Lambda (TypeScript) · AppSync with JavaScript resolvers · Step Functions with JSONata · EventBridge and SQS · Cognito · SES · OpenTelemetry

## Costs and cleanup

With normal use, all exercises stay within the Free Tier or cost a few cents. Tables, buckets and user pools have `RemovalPolicy.DESTROY`. Nothing is left after `npx cdk destroy`. Exceptions:

- **SES (12):** Deactivate verified identities and the active receipt rule set before the destroy: `aws ses set-active-receipt-rule-set` without a name.
- **Secrets (08):** You create the SecureString via the CLI, so you also delete it via the CLI: `aws ssm delete-parameter --name /orders/payments/api-key`.
- **Practice (17, 18):** Likewise `aws ssm delete-parameter --name /werkstatt/payments/api-key`.
- **Power Tuning (15):** Delete the stack from the Serverless Application Repository in CloudFormation.

## Workshop and slides

- Workshop (held in German): [“AWS serverless with Lambda, CDK, and DynamoDB”](https://workshops.mikebild.dev/w/aws-serverless/remote/)
- Slides: [slides.mikebild.dev/introduction-aws-serverless.en](https://slides.mikebild.dev/introduction-aws-serverless.en.html)
- PDF: [introduction-aws-serverless.en.pdf](https://media.mikebild.dev/site/mikebild/decks/introduction-aws-serverless/introduction-aws-serverless.en.pdf)
- Video: [introduction-aws-serverless.en.mp4](https://media.mikebild.dev/site/mikebild/decks/introduction-aws-serverless/introduction-aws-serverless.en.mp4)
- Posts on mikebild.dev:
  - [Serverless Auth with Cognito User Pools](https://www.mikebild.dev/en/blog/serverless-auth-with-cognito-user-pools/)
  - [Serverless Workflows with AWS Step Functions](https://www.mikebild.dev/en/blog/serverless-workflows-with-aws-step-functions/)
  - [GraphQL APIs with AppSync and DynamoDB](https://www.mikebild.dev/en/blog/graphql-apis-with-appsync-and-dynamodb/)
  - [DynamoDB Data Modeling: Single-Table Design](https://www.mikebild.dev/en/blog/dynamodb-data-modeling-single-table-design/)
  - [Serverless Transactional Email: SES and Lambda](https://www.mikebild.dev/en/blog/serverless-transactional-email-with-ses-and-lambda/)
  - [Understanding Lambda Performance and Cold Starts](https://www.mikebild.dev/en/blog/understanding-lambda-performance-and-cold-starts/)

## Archive

The first version from 2019 (CDK 0.21, JavaScript, Lerna, Yarn) is kept as an archive under [`archive/2019/`](archive/2019/). It is neither built nor tested and contains placeholders instead of real account and resource IDs.

## License

[MIT](LICENSE)
