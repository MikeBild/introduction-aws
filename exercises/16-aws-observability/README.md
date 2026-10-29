# 16 · Observability

**ID:** `aws-observability` · Zusatzkapitel

## Aufgabe

Instrumentiere `placeOrder` mit Logger und Metrics, aktiviere Tracing per OpenTelemetry und leg Alarme auf Errors und Dead-Letter-Nachrichten an.

## Ablauf

1. [`start/src/place-order.ts`](start/src/place-order.ts) loggt Text ohne Kontext. Stell auf den Powertools Logger um: `addContext`, `appendKeys` mit `orderId` und `correlationId`, `info` und `error`.
2. Schreib fachliche Metriken mit Powertools Metrics: `OrderPlaced`, `ItemsOrdered`, `OrderFailed`. Vergiss `publishStoredMetrics()` nicht.
3. Leg einen Span `placeOrder` mit `@opentelemetry/api` an. Ohne Layer ist er ein No-op, im Test also unschädlich.
4. Aktiviere in [`start/lib/observability-stack.ts`](start/lib/observability-stack.ts) Tracing und den OpenTelemetry-Layer per `adotInstrumentation`.
5. Leg ein SNS Topic und zwei Alarme an: Errors der Function und Nachrichten in der Dead Letter Queue.
6. Entferne das `.skip` in den Tests.
7. Deploy und erzeug Fehler:

   ```bash
   cd exercises/16-aws-observability/start
   npx cdk deploy -c alarmEmail=du@example.com
   for i in 1 2 3 4 5 6; do
     aws lambda invoke --function-name <PlaceOrderName> --invocation-type Event --cli-binary-format raw-in-base64-out \
       --payload "{\"orderId\":\"F$i\",\"customerId\":\"42\",\"items\":[],\"correlationId\":\"corr-$i\"}" /dev/null
   done
   ```

8. Such in CloudWatch Logs Insights alle Logs einer Bestellung:

   ```sql
   fields @timestamp, level, message, orderId, correlationId
   | filter correlationId = "corr-3"
   | sort @timestamp asc
   ```

## Prüfen

- Jede Log-Zeile ist JSON mit `orderId` und `correlationId`.
- Unter CloudWatch → Metrics → `Shop` stehen `OrderPlaced`, `ItemsOrdered` und `OrderFailed`.
- Der Errors-Alarm geht nach sechs Fehlern auf `ALARM`. Nach den Retries landen die asynchronen Aufrufe in der DLQ, und der zweite Alarm folgt.
- In X-Ray bzw. CloudWatch Traces siehst du den Span `placeOrder` mit dem DynamoDB-Aufruf darunter.

## OpenTelemetry-Layer

CDK bringt den ADOT-Layer für JavaScript mit (`AdotLambdaLayerJavaScriptSdkVersion.LATEST`). AWS bietet daneben einen neueren OpenTelemetry-Layer für CloudWatch Application Signals an. Seine ARN hängt von Region und Version ab und steht in der AWS-Doku. So nutzt du ihn:

```bash
npx cdk deploy -c otelLayerArn=arn:aws:lambda:<region>:<konto-aus-der-doku>:layer:<name>:<version>
```

Das X-Ray SDK ist seit Februar 2026 in Maintenance. Für neue Functions nimmst du OpenTelemetry.

## Lösung

[`solution/`](solution/)
