# Übungen: AWS Serverless

Übungs-Repo zum Workshop **„AWS Serverless in zwei Tagen“**. Zu jeder der 18 Lektionen findest du hier eine Aufgabe mit Startpunkt und Lösung. Alle Übungen drehen sich um dieselbe Domäne, den Werkstatt-Shop: Produkte, Bestellungen mit Positionen aus `productId`, `quantity` und `priceCents`, Geld immer in ganzen Cent.

**Stack (Oktober 2026):** Node.js 26 lokal · Lambda-Runtime `nodejs24.x` auf ARM · AWS CDK v2 (`aws-cdk-lib` 2.275) · AWS SDK for JavaScript v3 · TypeScript strict als ESM · Vitest · Powertools for AWS Lambda (TypeScript) · AppSync mit JavaScript-Resolvern · Step Functions mit JSONata · EventBridge und SQS · Cognito · SES · OpenTelemetry

## Vorbereitung

1. **Node.js 26** – `nvm use` liest die Version aus [`.nvmrc`](.nvmrc).
2. **AWS CLI v2** und ein eigenes Sandbox-Konto mit Admin-Rechten. Prüf die Anmeldung:

   ```bash
   aws sts get-caller-identity
   ```

3. Repo klonen, Abhängigkeiten installieren, alles prüfen:

   ```bash
   git clone https://github.com/MikeBild/introduction-aws.git
   cd introduction-aws
   npm ci
   npm run check        # tsc, Vitest und cdk synth – ganz ohne AWS-Konto
   ```

4. CDK einmal pro Konto und Region einrichten:

   ```bash
   npx cdk bootstrap
   ```

## Aufbau

```text
exercises/
  03-aws-cdk-basics/
    README.md            Aufgabe, Ablauf, Prüfkriterien
    start/               dein Startpunkt mit TODO-Kommentaren
      cdk.json           CDK App: node bin/app.ts (Node 26 führt TypeScript direkt aus)
      bin/app.ts
      lib/*-stack.ts     Infrastruktur
      src/*.ts           Lambda-Code
      test/*.test.ts     Tests mit describe.skip – entferne .skip, wenn du loslegst
    solution/            eine mögliche Lösung, gleiche Struktur
```

Alle Lektionen teilen sich ein `package.json` und ein `node_modules` im Root. Jede Lektion ist trotzdem eigenständig: Du kannst mit jeder einsteigen.

## So arbeitest du an einer Lektion

```bash
cd exercises/05-aws-api-gateway-http/start
npx vitest                    # Tests im Watch-Modus, ohne AWS
npx cdk synth                 # Template lokal erzeugen
npx cdk diff                  # Änderungen gegen dein Konto ansehen
npx cdk deploy                # deployen
npx cdk destroy               # aufräumen, wenn du fertig bist
```

Vom Root aus:

| Befehl | Was es tut |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` über alle Übungen |
| `npm test` | Vitest für alle Lösungen |
| `npm run test:start` | Vitest für alle Startpunkte (übersprungene Tests zählen als skipped) |
| `npm run synth` | `cdk synth` für alle CDK Apps mit Platzhalter-Account `123456789012` |
| `npm run synth -- 05` | `cdk synth` nur für Lektion 05 |
| `npm run check` | alles zusammen |

Die Tests brauchen kein AWS-Konto. SDK-Aufrufe ersetzt [`aws-sdk-client-mock`](https://github.com/m-radzikowski/aws-sdk-client-mock), Stacks prüfst du mit `aws-cdk-lib/assertions`.

## Lektionen

| Block | # | Lektion | Unit | Übung |
| --- | --- | --- | --- | --- |
| Tag 1 | 01 | Serverless-Grundhaltung | `aws-serverless-mindset` | [exercises/01-aws-serverless-mindset](exercises/01-aws-serverless-mindset) |
| Tag 1 | 02 | Lambda Handler in TypeScript | `aws-lambda-handler` | [exercises/02-aws-lambda-handler](exercises/02-aws-lambda-handler) |
| Tag 1 | 03 | CDK-Grundlagen | `aws-cdk-basics` | [exercises/03-aws-cdk-basics](exercises/03-aws-cdk-basics) |
| Tag 1 | 04 | IAM mit Least Privilege | `aws-iam-least-privilege` | [exercises/04-aws-iam-least-privilege](exercises/04-aws-iam-least-privilege) |
| Tag 1 | 05 | HTTP API mit API Gateway | `aws-api-gateway-http` | [exercises/05-aws-api-gateway-http](exercises/05-aws-api-gateway-http) |
| Tag 1 | 06 | DynamoDB modellieren | `aws-dynamodb-modeling` | [exercises/06-aws-dynamodb-modeling](exercises/06-aws-dynamodb-modeling) |
| Tag 1 | 07 | Single-Table-Design | `aws-dynamodb-single-table` | [exercises/07-aws-dynamodb-single-table](exercises/07-aws-dynamodb-single-table) |
| Tag 1 | 08 | Konfiguration und Secrets | `aws-config-secrets` | [exercises/08-aws-config-secrets](exercises/08-aws-config-secrets) |
| Tag 2 | 14 | Events und Queues | `aws-events-queues` | [exercises/14-aws-events-queues](exercises/14-aws-events-queues) |
| Tag 2 | 12 | Mails mit SES | `aws-ses-mail` | [exercises/12-aws-ses-mail](exercises/12-aws-ses-mail) |
| Tag 2 | 13 | Abläufe mit Step Functions | `aws-step-functions` | [exercises/13-aws-step-functions](exercises/13-aws-step-functions) |
| Tag 2 | 15 | Cold Starts messen und senken | `aws-cold-starts` | [exercises/15-aws-cold-starts](exercises/15-aws-cold-starts) |
| Tag 2 | 17 | Praxis Teil eins: Bestellung bis in die Tabelle | `aws-lab-end-to-end` | [exercises/17-aws-lab-end-to-end](exercises/17-aws-lab-end-to-end) |
| Tag 2 | 18 | Praxis Teil zwei: vom Event bis zum Versand | `aws-lab-fulfillment` | [exercises/18-aws-lab-fulfillment](exercises/18-aws-lab-fulfillment) |
| Zusatz | 09 | Cognito User Pools | `aws-cognito-user-pools` | [exercises/09-aws-cognito-user-pools](exercises/09-aws-cognito-user-pools) |
| Zusatz | 10 | API mit Cognito absichern | `aws-cognito-authorizer` | [exercises/10-aws-cognito-authorizer](exercises/10-aws-cognito-authorizer) |
| Zusatz | 11 | GraphQL mit AppSync | `aws-appsync-graphql` | [exercises/11-aws-appsync-graphql](exercises/11-aws-appsync-graphql) |
| Zusatz | 16 | Observability | `aws-observability` | [exercises/16-aws-observability](exercises/16-aws-observability) |

Die Nummern bleiben stabil, die Reihenfolge folgt der Agenda. Die Praxis-Lektionen 17 und 18 führen die Übungen 02 bis 08 und 12 bis 15 zu einem Stack `OrdersStack` zusammen. Die Zusatzkapitel kannst du einzeln nachholen.

01 und 06 beginnen mit einem Arbeitsblatt statt mit Code.

## Kosten und Aufräumen

Alle Übungen bleiben bei normaler Nutzung im Free Tier oder bei wenigen Cent. Tables, Buckets und User Pools haben `RemovalPolicy.DESTROY`. Nach `npx cdk destroy` bleibt nichts übrig. Ausnahmen:

- **SES (12):** Verifizierte Identitäten und das aktive Receipt Rule Set deaktivierst du vor dem Destroy: `aws ses set-active-receipt-rule-set` ohne Namen.
- **Secrets (08):** Den SecureString legst du per CLI an, also löschst du ihn auch per CLI: `aws ssm delete-parameter --name /orders/payments/api-key`.
- **Praxis (17, 18):** Ebenso `aws ssm delete-parameter --name /werkstatt/payments/api-key`.
- **Power Tuning (15):** Den Stack aus dem Serverless Application Repository löschst du in CloudFormation.

## Altes Material von 2019

Die erste Fassung dieses Repos von 2019 (CDK 0.21, JavaScript, Lerna, Yarn) liegt unverändert unter [`legacy/2019/`](legacy/2019/). Sie ist nur noch als Archiv gedacht und wird weder gebaut noch getestet. Account-IDs und Ressourcen-IDs darin sind durch Platzhalter ersetzt.

## Lizenz

[MIT](LICENSE)
