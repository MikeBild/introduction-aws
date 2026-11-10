*English · [Deutsch](README.de.md)*

# 10 · Securing the API with Cognito

**ID:** `aws-cognito-authorizer` · additional chapter

## Task

Protect `GET /orders/{orderId}` with an `HttpUserPoolAuthorizer` and return `404` when the order belongs to someone else.

## Steps

1. [`start/`](start/) contains a user pool, a table, an HTTP API and two functions – without an authorizer so far.
2. In [`start/lib/secure-orders-stack.ts`](start/lib/secure-orders-stack.ts), create an `HttpUserPoolAuthorizer` and attach it to both routes.
3. In [`start/src/get-order.ts`](start/src/get-order.ts), add the owner check: `sub` from the claims against `order.ownerId`.
4. Remove the `.skip` in the tests.
5. Deploy and try it with two accounts (sign in as in lesson 09):

   ```bash
   cd exercises/10-aws-cognito-authorizer/start
   npx cdk deploy
   API=<ApiUrl>
   ADA=$(aws cognito-idp initiate-auth --client-id <ClientId> --auth-flow USER_PASSWORD_AUTH \
     --auth-parameters USERNAME=ada@example.com,PASSWORD='…' --query AuthenticationResult.AccessToken --output text)
   ORDER=$(curl -s -X POST "$API/orders" -H "authorization: Bearer $ADA" -d '{"items":["BOOK"]}' | jq -r .orderId)
   curl -s -w '\n%{http_code}\n' "$API/orders/$ORDER" -H "authorization: Bearer $ADA"    # 200
   curl -s -w '\n%{http_code}\n' "$API/orders/$ORDER" -H "authorization: Bearer $GRACE"  # 404
   # GRACE is the access token of a second account, signed in like ADA
   curl -s -w '\n%{http_code}\n' "$API/orders/$ORDER"                                    # 401
   ```

## Check

- Without a token the API responds with `401` before the function runs.
- With someone else’s token the function responds with `404`, not with `403`.

## Solution

[`solution/`](solution/)
