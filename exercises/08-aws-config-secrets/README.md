*English · [Deutsch](README.de.md)*

# 08 · Configuration and secrets

**ID:** `aws-config-secrets`

## Task

Create an API key as a SecureString, grant a function read access and load it with Powertools Parameters and a five-minute cache.

## Steps

1. Read [`start/lib/payments-stack.ts`](start/lib/payments-stack.ts). The API key sits in plain text in the environment variables – and therefore also in the template and in the console.
2. Create the key as a SecureString. CloudFormation cannot do that, so use the CLI:

   ```bash
   aws ssm put-parameter --name /orders/payments/api-key \
     --type SecureString --value 'sk_test_dein_wert'
   ```

3. Reference the parameter in the stack with `StringParameter.fromSecureStringParameterAttributes` and grant `grantRead`. Create `/orders/max-items` as a regular `StringParameter`.
4. Pass only the names of the parameters to the function.
5. Load both values in [`start/src/charge-payment.ts`](start/src/charge-payment.ts) with `getParameter` from `@aws-lambda-powertools/parameters/ssm`: `decrypt: true` for the key, `maxAge: 300` for both.
6. Remove the `.skip` in the tests, then deploy and invoke the function:

   ```bash
   cd exercises/08-aws-config-secrets/start
   npx cdk deploy
   aws lambda invoke --function-name <ChargePayment-Name> \
     --cli-binary-format raw-in-base64-out \
     --payload '{"orderId":"A7","amount":42,"items":2}' out.json && cat out.json
   ```

## Check

- In the Lambda console, “Environment variables” lists parameter names only.
- A second invocation within five minutes does not read SSM again (test “caches the parameters between invocations”).

## Going further

For secrets with rotation you use Secrets Manager: `getSecret('payments/api-key', { maxAge: 300 })` from `@aws-lambda-powertools/parameters/secrets`.

## Solution

[`solution/`](solution/)
