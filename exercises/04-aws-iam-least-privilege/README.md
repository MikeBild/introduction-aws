*English · [Deutsch](README.de.md)*

# 04 · IAM with least privilege

**ID:** `aws-iam-least-privilege`

## Task

Give one function read access only to the orders table and a second one write access only. Check both roles in `cdk diff`.

## Steps

1. Read [`start/lib/orders-stack.ts`](start/lib/orders-stack.ts). Both functions get `dynamodb:*` on `*` – the classic “allow everything for now”.
2. Deploy the starting state once so that `cdk diff` has something to compare against later:

   ```bash
   cd exercises/04-aws-iam-least-privilege/start
   npx cdk deploy
   ```

3. Replace the broad statements: `table.grantReadData(listOrders)` and `table.grantWriteData(placeOrder)`.
4. Read `npx cdk diff`. In the section “IAM Statement Changes” the wildcards disappear, and individual actions on exactly one table appear instead.
5. Remove the `.skip` in [`start/test/orders-stack.test.ts`](start/test/orders-stack.test.ts). The test checks the permissions per role.

## Check

- The role of `ListOrders` contains `dynamodb:Query`, but no `PutItem`.
- The role of `PlaceOrder` contains `dynamodb:PutItem`, but no `Query` or `GetItem`.
- No statement contains `*` as action or resource.

## Solution

[`solution/`](solution/)
