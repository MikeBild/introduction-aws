*English · [Deutsch](README.de.md)*

# 16 · Observability

**ID:** `aws-observability` · additional chapter

## Task

Instrument `placeOrder` with Logger and Metrics, enable tracing via OpenTelemetry and create alarms on errors and dead letter messages.

## Steps

1. [`start/src/place-order.ts`](start/src/place-order.ts) logs text without context. Switch to the Powertools Logger: `addContext`, `appendKeys` with `orderId` and `correlationId`, `info` and `error`.
2. Write business metrics with Powertools Metrics: `OrderPlaced`, `ItemsOrdered`, `OrderFailed`. Do not forget `publishStoredMetrics()`.
3. Create a span `placeOrder` with `@opentelemetry/api`. Without a layer it is a no-op, so it is harmless in the tests.
4. In [`start/lib/observability-stack.ts`](start/lib/observability-stack.ts), enable tracing and the OpenTelemetry layer via `adotInstrumentation`.
5. Create an SNS topic and two alarms: errors of the function and messages in the dead letter queue.
6. Remove the `.skip` in the tests.
7. Deploy and produce errors:

   ```bash
   cd exercises/16-aws-observability/start
   npx cdk deploy -c alarmEmail=du@example.com
   for i in 1 2 3 4 5 6; do
     aws lambda invoke --function-name <PlaceOrderName> --invocation-type Event --cli-binary-format raw-in-base64-out \
       --payload "{\"orderId\":\"F$i\",\"customerId\":\"42\",\"items\":[],\"correlationId\":\"corr-$i\"}" /dev/null
   done
   ```

8. In CloudWatch Logs Insights, find all logs of one order:

   ```sql
   fields @timestamp, level, message, orderId, correlationId
   | filter correlationId = "corr-3"
   | sort @timestamp asc
   ```

## Check

- Every log line is JSON with `orderId` and `correlationId`.
- Under CloudWatch → Metrics → `Shop` you find `OrderPlaced`, `ItemsOrdered` and `OrderFailed`.
- The errors alarm goes to `ALARM` after six errors. After the retries, the asynchronous invocations end up in the DLQ, and the second alarm follows.
- In X-Ray or CloudWatch Traces you see the span `placeOrder` with the DynamoDB call below it.

## OpenTelemetry layer

CDK ships the ADOT layer for JavaScript (`AdotLambdaLayerJavaScriptSdkVersion.LATEST`). AWS also offers a newer OpenTelemetry layer for CloudWatch Application Signals. Its ARN depends on region and version and is listed in the AWS docs. This is how you use it:

```bash
npx cdk deploy -c otelLayerArn=arn:aws:lambda:<region>:<account-from-the-docs>:layer:<name>:<version>
```

The X-Ray SDK has been in maintenance since February 2026. For new functions you use OpenTelemetry.

## Solution

[`solution/`](solution/)
