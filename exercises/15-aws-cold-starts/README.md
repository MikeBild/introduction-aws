*English · [Deutsch](README.de.md)*

# 15 · Measuring and reducing cold starts

**ID:** `aws-cold-starts`

## Task

Measure the Init Duration of your function, shrink the bundle and compare 512, 1024 and 1769 MB of memory with AWS Lambda Power Tuning.

## Steps

1. Measure locally how large the bundle of [`start/src/heavy.ts`](start/src/heavy.ts) is:

   ```bash
   cd exercises/15-aws-cold-starts/start
   node src/bundle-size.ts
   ```

2. Write [`start/src/lean.ts`](start/src/lean.ts): only one SDK client, targeted imports, no library for a check that takes three lines.
3. Add the function `Lean` in [`start/lib/cold-starts-stack.ts`](start/lib/cold-starts-stack.ts) – SDK as external, minified. Measure again with `node src/bundle-size.ts`.
4. Implement `parseReport` and `summarize` in [`start/src/report.ts`](start/src/report.ts) and remove the `.skip` in the tests.
5. Deploy, invoke both functions a few times and evaluate the logs. Every new configuration forces a cold start:

   ```bash
   npx cdk deploy
   for i in 1 2 3 4 5; do
     aws lambda invoke --function-name <HeavyArn> --cli-binary-format raw-in-base64-out --payload '{"orderId":"A7"}' /dev/null
     aws lambda invoke --function-name <LeanArn>  --cli-binary-format raw-in-base64-out --payload '{"orderId":"A7"}' /dev/null
   done
   aws logs filter-log-events --log-group-name /aws/lambda/<Heavy-Name> --filter-pattern REPORT \
     --query 'events[].message' --output text | node src/analyze-logs.ts
   ```

6. Compare memory with [AWS Lambda Power Tuning](https://github.com/alexcasalboni/aws-lambda-power-tuning): deploy it once from the Serverless Application Repository (console → “Serverless Application Repository” → `aws-lambda-power-tuning`). Enter the ARN in [`start/power-tuning-input.json`](start/power-tuning-input.json) and start the state machine:

   ```bash
   aws stepfunctions start-execution --state-machine-arn <powerTuningStateMachine> \
     --input file://power-tuning-input.json
   ```

   The result contains a link to a chart with cost and duration per memory level.

## Check

- The lean bundle is at least ten times smaller. Locally, the test `bundle-size.test.ts` checks this.
- The Init Duration of `Lean` is well below that of `Heavy`.
- From 1769 MB on, the function has a full vCPU. Above that, the duration only drops if your code uses multiple threads.

## Going further

- Provisioned concurrency keeps environments warm – for a price, even without requests.
- `cdk deploy -c memorySize=1769` changes the memory without a code change.

## Solution

[`solution/`](solution/)
