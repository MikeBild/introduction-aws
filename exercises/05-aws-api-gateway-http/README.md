# 05 · HTTP-API mit API Gateway

**ID:** `aws-api-gateway-http`

## Aufgabe

Leg eine HTTP-API mit den Routes `GET /orders` und `POST /orders` an, je mit eigener Funktion, und ruf beide per curl auf.

## Ablauf

1. Die Handler in [`start/src/`](start/src/) sind fertig und getestet (`handlers.test.ts`). Dein Teil ist die API im Stack.
2. Ergänze in [`start/lib/orders-api-stack.ts`](start/lib/orders-api-stack.ts) eine `HttpApi` mit CORS und zwei Routes mit `HttpLambdaIntegration`.
3. Gib die URL als `CfnOutput` aus und deploy:

   ```bash
   cd exercises/05-aws-api-gateway-http/start
   npx cdk deploy
   ```

4. Ruf beide Routes auf. `API` ist der Wert aus `ApiUrl`:

   ```bash
   API=https://abc123.execute-api.eu-central-1.amazonaws.com
   curl -s -X POST "$API/orders" -H 'content-type: application/json' \
     -d '{"customerId":"42","items":[{"sku":"BOOK","quantity":2}]}'
   curl -s "$API/orders?customerId=42"
   curl -s -X POST "$API/orders" -d '{}' -w '\n%{http_code}\n'   # 400
   ```

5. Entferne das `.skip` in [`start/test/orders-api-stack.test.ts`](start/test/orders-api-stack.test.ts).

## Prüfen

- `POST` liefert `201` mit `orderId`, `GET` liefert die Bestellung als Liste.
- Ein ungültiger Body liefert `400`, ohne dass die Funktion in DynamoDB schreibt.

## Zum Weiterdenken

- Function URL statt HTTP-API: `placeOrder.addFunctionUrl()` – ein Endpoint, kein Routing, keine JWT-Prüfung.
- REST-API: nur, wenn du API Keys, Usage Plans oder Request-Validierung am Gateway brauchst.

## Lösung

[`solution/`](solution/)
