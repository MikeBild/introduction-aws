# 07 · Single-Table-Design

**Unit:** `aws-dynamodb-single-table` · **Format:** Breakout oder Whiteboard, danach Code

## Aufgabe

Leg Kunden, Bestellungen und Produkte in eine Table und beantworte „Bestellungen eines Produkts“ über einen Inverted Index als GSI.

## Datenmodell

| Entity | pk | sk |
| --- | --- | --- |
| Kunde | `CUSTOMER#42` | `PROFILE` |
| Bestellung | `CUSTOMER#42` | `ORDER#2026-10-17#A7` |
| Position | `ORDER#A7` | `PRODUCT#9` |
| Produkt | `PRODUCT#9` | `PRODUCT#9` |

Der Inverted Index `GSI1` dreht die Keys um: `sk` wird Partition Key, `pk` Sort Key. Aus „Positionen einer Bestellung“ wird so „Bestellungen eines Produkts“.

## Ablauf

1. Lies [`start/src/items.ts`](start/src/items.ts) mit Entities und Testdaten.
2. Ergänze `GSI1` in [`start/lib/shop-table-stack.ts`](start/lib/shop-table-stack.ts).
3. Implementiere `getOrderLines` und ersetze den Scan in `getOrdersOfProduct` in [`start/src/shop-repository.ts`](start/src/shop-repository.ts) durch eine Query auf `GSI1`.
4. Entferne das `.skip` in den Tests.
5. Optional gegen AWS:

   ```bash
   cd exercises/07-aws-dynamodb-single-table/start
   npx cdk deploy
   TABLE_NAME=<TableName> node src/seed.ts
   aws dynamodb query --table-name <TableName> --index-name GSI1 \
     --key-condition-expression 'sk = :p AND begins_with(pk, :o)' \
     --expression-attribute-values '{":p":{"S":"PRODUCT#9"},":o":{"S":"ORDER#"}}'
   ```

## Prüfen

- „Bestellungen eines Produkts“ liefert A7, A3 und B2 – per Query, ohne Scan und ohne FilterExpression.
- Kunde und Bestellungen kommen mit einer einzigen Query.

## Lösung

[`solution/`](solution/)
