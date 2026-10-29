# 10 · API mit Cognito absichern

**Unit:** `aws-cognito-authorizer`

## Aufgabe

Schütz `GET /orders/{orderId}` mit einem `HttpUserPoolAuthorizer` und gib `404` zurück, wenn die Bestellung einem anderen Nutzer gehört.

## Ablauf

1. [`start/`](start/) enthält User Pool, Table, HTTP API und zwei Functions – noch ohne Authorizer.
2. Leg in [`start/lib/secure-orders-stack.ts`](start/lib/secure-orders-stack.ts) einen `HttpUserPoolAuthorizer` an und häng ihn an beide Routes.
3. Ergänze in [`start/src/get-order.ts`](start/src/get-order.ts) den Owner-Check: `sub` aus den Claims gegen `order.ownerId`.
4. Entferne das `.skip` in den Tests.
5. Deploy und probier es mit zwei Nutzern aus (Anmeldung wie in Lektion 09):

   ```bash
   cd exercises/10-aws-cognito-authorizer/start
   npx cdk deploy
   API=<ApiUrl>
   ADA=$(aws cognito-idp initiate-auth --client-id <ClientId> --auth-flow USER_PASSWORD_AUTH \
     --auth-parameters USERNAME=ada@example.com,PASSWORD='…' --query AuthenticationResult.AccessToken --output text)
   ORDER=$(curl -s -X POST "$API/orders" -H "authorization: Bearer $ADA" -d '{"items":["BOOK"]}' | jq -r .orderId)
   curl -s -w '\n%{http_code}\n' "$API/orders/$ORDER" -H "authorization: Bearer $ADA"    # 200
   curl -s -w '\n%{http_code}\n' "$API/orders/$ORDER" -H "authorization: Bearer $GRACE"  # 404
   # GRACE ist das Access Token eines zweiten Nutzers, angemeldet wie ADA
   curl -s -w '\n%{http_code}\n' "$API/orders/$ORDER"                                    # 401
   ```

## Prüfen

- Ohne Token antwortet die API mit `401`, bevor die Function läuft.
- Mit fremdem Token antwortet die Function mit `404`, nicht mit `403`.

## Lösung

[`solution/`](solution/)
