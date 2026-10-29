# 06 · DynamoDB modellieren

**Unit:** `aws-dynamodb-modeling` · **Format:** Breakout oder Whiteboard, danach Code

## Aufgabe

Schreib fünf Zugriffsmuster für Bestellungen bei deinem Unternehmen auf und leite daraus Keys und GSIs ab. Prüf jedes Muster mit einer Query statt Scan.

## Ablauf

1. Füll [`start/ZUGRIFFSMUSTER.md`](start/ZUGRIFFSMUSTER.md) aus: erst die Fragen, dann Keys und Indexe.
2. Vergleich mit dem Beispiel in [`solution/ZUGRIFFSMUSTER.md`](solution/ZUGRIFFSMUSTER.md).
3. In [`start/src/orders-repository.ts`](start/src/orders-repository.ts) beantwortet jede Function ihre Frage per `Scan`. Ersetze jeden Scan durch `GetItem` oder `Query`.
4. Ergänze die GSIs in [`start/lib/orders-table-stack.ts`](start/lib/orders-table-stack.ts).
5. Entferne das `.skip` in den Tests. Sie schlagen fehl, sobald irgendwo ein `Scan` läuft.
6. Optional gegen AWS:

   ```bash
   cd exercises/06-aws-dynamodb-modeling/start
   npx cdk deploy
   TABLE_NAME=<TableName aus dem Output> node src/seed.ts
   aws dynamodb query --table-name <TableName> \
     --key-condition-expression 'pk = :pk AND begins_with(sk, :o)' \
     --expression-attribute-values '{":pk":{"S":"CUSTOMER#42"},":o":{"S":"ORDER#"}}' \
     --no-scan-index-forward --return-consumed-capacity TOTAL
   ```

   Vergleich `ConsumedCapacity` mit einem `aws dynamodb scan` auf dieselbe Table.

## Prüfen

- Jede der fünf Fragen hat einen Key oder GSI und läuft per `GetItem` oder `Query`.
- Kein `Scan` im Request-Pfad.

## Lösung

[`solution/`](solution/)
