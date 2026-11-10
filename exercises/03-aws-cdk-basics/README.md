*English · [Deutsch](README.de.md)*

# 03 · CDK basics

**ID:** `aws-cdk-basics`

## Task

Create a TypeScript project with `cdk init`, add a `NodejsFunction` and a `TableV2`, and review the changes with `cdk diff` before deploying.

## Steps

1. Optional, to experience `cdk init` once yourself – in an empty folder outside this repo:

   ```bash
   mkdir orders && cd orders
   npx aws-cdk@latest init app --language typescript
   ```

   Then continue here: [`start/`](start/) contains the same empty stack, already set up for ESM, Node.js 26 and this repo.
2. In [`start/lib/orders-stack.ts`](start/lib/orders-stack.ts), add a `TableV2` with partition key `pk`.
3. Add a `NodejsFunction` for [`start/src/place-order.ts`](start/src/place-order.ts) with `Runtime.NODEJS_24_X` and `Architecture.ARM_64`.
4. Grant the function access with `table.grantReadWriteData(placeOrder)`.
5. Check the template locally and then against your account:

   ```bash
   cd exercises/03-aws-cdk-basics/start
   npx cdk synth                 # generate the template locally
   npx cdk diff                  # changes against the deployed stack
   npx cdk deploy                # only after reading the diff
   npx cdk destroy               # clean up at the end
   ```

6. Remove the `.skip` in [`start/test/orders-stack.test.ts`](start/test/orders-stack.test.ts) and check the stack with assertions.

## Check

- `cdk diff` shows table, function, role and policy – and nothing else.
- The IAM part of the diff contains only DynamoDB actions on exactly this table.

## Solution

[`solution/`](solution/)
