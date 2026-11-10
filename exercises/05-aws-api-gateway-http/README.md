*English · [Deutsch](README.de.md)*

# 05 · HTTP API with API Gateway

**ID:** `aws-api-gateway-http`

## Task

Create an HTTP API with the routes `GET /orders` and `POST /orders`, each with its own function, and call both with curl.

## Steps

1. The handlers in [`start/src/`](start/src/) are done and tested (`handlers.test.ts`). Your part is the API in the stack.
2. In [`start/lib/orders-api-stack.ts`](start/lib/orders-api-stack.ts), add an `HttpApi` with CORS and two routes with `HttpLambdaIntegration`.
3. Output the URL as a `CfnOutput` and deploy:

   ```bash
   cd exercises/05-aws-api-gateway-http/start
   npx cdk deploy
   ```

4. Call both routes. `API` is the value from `ApiUrl`:

   ```bash
   API=https://abc123.execute-api.eu-central-1.amazonaws.com
   curl -s -X POST "$API/orders" -H 'content-type: application/json' \
     -d '{"customerId":"42","items":[{"sku":"BOOK","quantity":2}]}'
   curl -s "$API/orders?customerId=42"
   curl -s -X POST "$API/orders" -d '{}' -w '\n%{http_code}\n'   # 400
   ```

5. Remove the `.skip` in [`start/test/orders-api-stack.test.ts`](start/test/orders-api-stack.test.ts).

## Check

- `POST` returns `201` with an `orderId`, `GET` returns the order as a list.
- An invalid body returns `400` without the function writing to DynamoDB.

## Going further

- Function URL instead of HTTP API: `placeOrder.addFunctionUrl()` – one endpoint, no routing, no JWT check.
- REST API: only if you need API keys, usage plans or request validation at the gateway.

## Solution

[`solution/`](solution/)
