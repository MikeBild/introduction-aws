*English · [Deutsch](README.de.md)*

# 06 · Modeling DynamoDB

**ID:** `aws-dynamodb-modeling` · **Format:** breakout or whiteboard, then code

## Task

Write down five access patterns for orders at your company and derive keys and GSIs from them. Check each pattern with a Query instead of a Scan.

## Steps

1. Fill in [`start/ZUGRIFFSMUSTER.md`](start/ZUGRIFFSMUSTER.md): first the questions, then keys and indexes.
2. Compare with the example in [`solution/ZUGRIFFSMUSTER.md`](solution/ZUGRIFFSMUSTER.md).
3. In [`start/src/orders-repository.ts`](start/src/orders-repository.ts), every function answers its question with a `Scan`. Replace each Scan with `GetItem` or `Query`.
4. Add the GSIs in [`start/lib/orders-table-stack.ts`](start/lib/orders-table-stack.ts).
5. Remove the `.skip` in the tests. They fail as soon as a `Scan` runs anywhere.
6. Optionally against AWS:

   ```bash
   cd exercises/06-aws-dynamodb-modeling/start
   npx cdk deploy
   TABLE_NAME=<TableName from the output> node src/seed.ts
   aws dynamodb query --table-name <TableName> \
     --key-condition-expression 'pk = :pk AND begins_with(sk, :o)' \
     --expression-attribute-values '{":pk":{"S":"CUSTOMER#42"},":o":{"S":"ORDER#"}}' \
     --no-scan-index-forward --return-consumed-capacity TOTAL
   ```

   Compare `ConsumedCapacity` with an `aws dynamodb scan` on the same table.

## Check

- Each of the five questions has a key or GSI and runs via `GetItem` or `Query`.
- No `Scan` in the request path.

## Solution

[`solution/`](solution/)
