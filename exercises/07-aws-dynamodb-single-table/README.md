*English · [Deutsch](README.de.md)*

# 07 · Single-table design

**ID:** `aws-dynamodb-single-table` · **Format:** breakout or whiteboard, then code

## Task

Put customers, orders and products into one table and answer “orders of a product” through an inverted index as a GSI.

## Data model

| Entity | pk | sk |
| --- | --- | --- |
| Customer | `CUSTOMER#42` | `PROFILE` |
| Order | `CUSTOMER#42` | `ORDER#2026-10-17#A7` |
| Line item | `ORDER#A7` | `PRODUCT#9` |
| Product | `PRODUCT#9` | `PRODUCT#9` |

The inverted index `GSI1` swaps the keys: `sk` becomes the partition key, `pk` the sort key. “Line items of an order” thus becomes “orders of a product”.

## Steps

1. Read [`start/src/items.ts`](start/src/items.ts) with entities and test data.
2. Add `GSI1` in [`start/lib/shop-table-stack.ts`](start/lib/shop-table-stack.ts).
3. Implement `getOrderLines` and replace the Scan in `getOrdersOfProduct` in [`start/src/shop-repository.ts`](start/src/shop-repository.ts) with a Query on `GSI1`.
4. Remove the `.skip` in the tests.
5. Optionally against AWS:

   ```bash
   cd exercises/07-aws-dynamodb-single-table/start
   npx cdk deploy
   TABLE_NAME=<TableName> node src/seed.ts
   aws dynamodb query --table-name <TableName> --index-name GSI1 \
     --key-condition-expression 'sk = :p AND begins_with(pk, :o)' \
     --expression-attribute-values '{":p":{"S":"PRODUCT#9"},":o":{"S":"ORDER#"}}'
   ```

## Check

- “Orders of a product” returns A7, A3 and B2 – via Query, without Scan and without FilterExpression.
- Customer and orders come back with a single Query.

## Solution

[`solution/`](solution/)
