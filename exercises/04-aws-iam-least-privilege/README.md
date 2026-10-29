# 04 · IAM mit Least Privilege

**ID:** `aws-iam-least-privilege`

## Aufgabe

Gib einer Function nur Lesezugriff auf die Orders-Table und einer zweiten nur Schreibzugriff. Prüf beide Roles in `cdk diff`.

## Ablauf

1. Lies [`start/lib/orders-stack.ts`](start/lib/orders-stack.ts). Beide Functions bekommen `dynamodb:*` auf `*` – das klassische „erst mal alles erlauben“.
2. Deploy den Ausgangszustand einmal, damit `cdk diff` später etwas zu vergleichen hat:

   ```bash
   cd exercises/04-aws-iam-least-privilege/start
   npx cdk deploy
   ```

3. Ersetze die breiten Statements: `table.grantReadData(listOrders)` und `table.grantWriteData(placeOrder)`.
4. Lies `npx cdk diff`. Im Abschnitt „IAM Statement Changes“ verschwinden die Wildcards, dafür erscheinen einzelne Aktionen auf genau eine Table.
5. Entferne das `.skip` in [`start/test/orders-stack.test.ts`](start/test/orders-stack.test.ts). Der Test prüft die Rechte pro Role.

## Prüfen

- Die Role von `ListOrders` enthält `dynamodb:Query`, aber kein `PutItem`.
- Die Role von `PlaceOrder` enthält `dynamodb:PutItem`, aber kein `Query` oder `GetItem`.
- Kein Statement enthält `*` als Action oder Resource.

## Lösung

[`solution/`](solution/)
