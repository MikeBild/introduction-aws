# 08 · Konfiguration und Secrets

**ID:** `aws-config-secrets`

## Aufgabe

Leg einen API Key als SecureString an, gib einer Function Leserechte und lade ihn mit Powertools Parameters und fünf Minuten Cache.

## Ablauf

1. Lies [`start/lib/payments-stack.ts`](start/lib/payments-stack.ts). Der API Key steht als Klartext in den Umgebungsvariablen – also auch im Template und in der Console.
2. Leg den Key als SecureString an. CloudFormation kann das nicht, deshalb per CLI:

   ```bash
   aws ssm put-parameter --name /orders/payments/api-key \
     --type SecureString --value 'sk_test_dein_wert'
   ```

3. Referenzier den Parameter im Stack mit `StringParameter.fromSecureStringParameterAttributes` und vergib `grantRead`. Leg `/orders/max-items` als normalen `StringParameter` an.
4. Übergib der Function nur die Namen der Parameter.
5. Lade beide Werte in [`start/src/charge-payment.ts`](start/src/charge-payment.ts) mit `getParameter` aus `@aws-lambda-powertools/parameters/ssm`: `decrypt: true` für den Key, `maxAge: 300` für beide.
6. Entferne das `.skip` in den Tests, dann deploy und ruf die Function auf:

   ```bash
   cd exercises/08-aws-config-secrets/start
   npx cdk deploy
   aws lambda invoke --function-name <ChargePayment-Name> \
     --cli-binary-format raw-in-base64-out \
     --payload '{"orderId":"A7","amount":42,"items":2}' out.json && cat out.json
   ```

## Prüfen

- In der Lambda Console stehen unter „Umgebungsvariablen“ nur Parameter-Namen.
- Ein zweiter Aufruf innerhalb von fünf Minuten liest SSM nicht erneut (Test „cacht die Parameter“).

## Zum Weiterdenken

Für Secrets mit Rotation nimmst du Secrets Manager: `getSecret('payments/api-key', { maxAge: 300 })` aus `@aws-lambda-powertools/parameters/secrets`.

## Lösung

[`solution/`](solution/)
