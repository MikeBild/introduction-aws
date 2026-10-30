# Übungen: AWS Serverless

Übungs-Repo zum Workshop „AWS Serverless mit Lambda, CDK und DynamoDB“. Zu jeder der 18 Lektionen findest du hier eine Übung mit Startpunkt, Tests und Lösung. Alle Übungen drehen sich um dieselbe Domäne, den Werkstatt-Shop: Produkte, Bestellungen mit Positionen aus `productId`, `quantity` und `priceCents`, Geld immer in ganzen Cent.

## Was du lernst

- Lambda-Handler, CDK-Stacks und IAM-Rechte in TypeScript bauen und testen
- DynamoDB nach Zugriffsmustern modellieren, bis zum Single-Table-Design
- Abläufe mit EventBridge, SQS, Step Functions und SES entkoppeln

## Voraussetzungen

- **Node.js 26** – `nvm use` liest die Version aus [`.nvmrc`](.nvmrc).
- **AWS CLI v2** und ein eigenes Sandbox-Konto mit Admin-Rechten. Prüf die Anmeldung:

  ```bash
  aws sts get-caller-identity
  ```

Für die Tests brauchst du kein AWS-Konto, erst für `cdk diff` und `cdk deploy`.

## Einrichten

1. Repo klonen, Abhängigkeiten installieren, alles prüfen:

   ```bash
   git clone https://github.com/MikeBild/introduction-aws.git
   cd introduction-aws
   npm ci
   npm run check        # tsc, Vitest und cdk synth – ganz ohne AWS-Konto
   ```

2. CDK einmal pro Konto und Region einrichten:

   ```bash
   npx cdk bootstrap
   ```

## So arbeitest du mit einer Übung

Du arbeitest im Startpunkt `start/`: Arbeite die TODO-Kommentare ab, entferne in den Tests das `.skip` und vergleich am Ende mit der Lösung in `solution/`. Wie eine Übung aufgebaut ist, steht unter [Aufbau](#aufbau).

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
| `npm run synth` | `cdk synth` für alle CDK-Apps mit Platzhalter-Account `123456789012` |
| `npm run synth -- 05` | `cdk synth` nur für Übung 05 |
| `npm run check` | alles zusammen |

Die Tests brauchen kein AWS-Konto. SDK-Aufrufe ersetzt [`aws-sdk-client-mock`](https://github.com/m-radzikowski/aws-sdk-client-mock), Stacks prüfst du mit `aws-cdk-lib/assertions`.

## Übungen

| Block | # | Lektion | ID | Übung |
| --- | --- | --- | --- | --- |
| Tag 1 | 01 | Was nimmt dir Serverless wirklich ab? | `aws-serverless-mindset` | [exercises/01-aws-serverless-mindset](exercises/01-aws-serverless-mindset) |
| Tag 1 | 02 | Eine Lambda-Function ist nur ein Handler | `aws-lambda-handler` | [exercises/02-aws-lambda-handler](exercises/02-aws-lambda-handler) |
| Tag 1 | 03 | Infrastruktur gehört als TypeScript ins Repo | `aws-cdk-basics` | [exercises/03-aws-cdk-basics](exercises/03-aws-cdk-basics) |
| Tag 1 | 04 | Jede Funktion bekommt nur ihre eigenen Rechte | `aws-iam-least-privilege` | [exercises/04-aws-iam-least-privilege](exercises/04-aws-iam-least-privilege) |
| Tag 1 | 05 | Wie kommt ein HTTP Request zur Funktion? | `aws-api-gateway-http` | [exercises/05-aws-api-gateway-http](exercises/05-aws-api-gateway-http) |
| Tag 1 | 06 | Erst Zugriffsmuster, dann Tabelle | `aws-dynamodb-modeling` | [exercises/06-aws-dynamodb-modeling](exercises/06-aws-dynamodb-modeling) |
| Tag 1 | 07 | Wann lohnt sich Single-Table-Design? | `aws-dynamodb-single-table` | [exercises/07-aws-dynamodb-single-table](exercises/07-aws-dynamodb-single-table) |
| Tag 1 | 08 | Wohin mit Konfiguration und Secrets? | `aws-config-secrets` | [exercises/08-aws-config-secrets](exercises/08-aws-config-secrets) |
| Tag 2 | 14 | Jede Nachricht kann zweimal ankommen | `aws-events-queues` | [exercises/14-aws-events-queues](exercises/14-aws-events-queues) |
| Tag 2 | 12 | Bei SES steckt der Aufwand im DNS, nicht im Code | `aws-ses-mail` | [exercises/12-aws-ses-mail](exercises/12-aws-ses-mail) |
| Tag 2 | 13 | Abläufe als State Machine statt Aufrufketten | `aws-step-functions` | [exercises/13-aws-step-functions](exercises/13-aws-step-functions) |
| Tag 2 | 15 | Cold Starts messen statt fürchten | `aws-cold-starts` | [exercises/15-aws-cold-starts](exercises/15-aws-cold-starts) |
| Tag 2 | 17 | Praxis Teil eins, die Bestellung bis in die Tabelle | `aws-lab-end-to-end` | [exercises/17-aws-lab-end-to-end](exercises/17-aws-lab-end-to-end) |
| Tag 2 | 18 | Praxis Teil zwei, vom Event bis zum Versand | `aws-lab-fulfillment` | [exercises/18-aws-lab-fulfillment](exercises/18-aws-lab-fulfillment) |

### Zusatzkapitel

| # | Lektion | ID | Übung |
| --- | --- | --- | --- |
| 09 | Brauchst du noch einen eigenen Auth-Server? | `aws-cognito-user-pools` | [exercises/09-aws-cognito-user-pools](exercises/09-aws-cognito-user-pools) |
| 10 | Wer prüft das Token und wer die Rechte? | `aws-cognito-authorizer` | [exercises/10-aws-cognito-authorizer](exercises/10-aws-cognito-authorizer) |
| 11 | Braucht GraphQL noch einen eigenen Server? | `aws-appsync-graphql` | [exercises/11-aws-appsync-graphql](exercises/11-aws-appsync-graphql) |
| 16 | Ohne Server zum Einloggen bleiben nur Signale | `aws-observability` | [exercises/16-aws-observability](exercises/16-aws-observability) |

Die Nummern bleiben stabil, die Reihenfolge folgt der Agenda. Die Praxis-Lektionen 17 und 18 führen die Übungen 02 bis 08 und 12 bis 15 zu einem Stack `OrdersStack` zusammen. Die Zusatzkapitel kannst du einzeln nachholen.

Die Übungen 01 und 06 beginnen mit einem Arbeitsblatt statt mit Code.

## Aufbau

```text
exercises/
  03-aws-cdk-basics/
    README.md            Aufgabe, Ablauf, Prüfkriterien
    start/               dein Startpunkt mit TODO-Kommentaren
      cdk.json           CDK-App: node bin/app.ts (Node 26 führt TypeScript direkt aus)
      bin/app.ts
      lib/*-stack.ts     Infrastruktur
      src/*.ts           Lambda-Code
      test/*.test.ts     Tests mit describe.skip – entferne .skip, wenn du anfängst
    solution/            eine mögliche Lösung, gleiche Struktur
```

Alle Übungen teilen sich ein `package.json` und ein `node_modules` im Root. Jede Übung ist trotzdem eigenständig: Du kannst mit jeder einsteigen.

## Stack

Stand Oktober 2026: Node.js 26 lokal · Lambda-Runtime `nodejs24.x` auf ARM · AWS CDK v2 (`aws-cdk-lib` 2.275) · AWS SDK for JavaScript v3 · TypeScript strict als ESM · Vitest · Powertools for AWS Lambda (TypeScript) · AppSync mit JavaScript-Resolvern · Step Functions mit JSONata · EventBridge und SQS · Cognito · SES · OpenTelemetry

## Kosten und Aufräumen

Alle Übungen bleiben bei normaler Nutzung im Free Tier oder bei wenigen Cent. Tables, Buckets und User Pools haben `RemovalPolicy.DESTROY`. Nach `npx cdk destroy` bleibt nichts übrig. Ausnahmen:

- **SES (12):** Verifizierte Identitäten und das aktive Receipt Rule Set deaktivierst du vor dem Destroy: `aws ses set-active-receipt-rule-set` ohne Namen.
- **Secrets (08):** Den SecureString legst du per CLI an, also löschst du ihn auch per CLI: `aws ssm delete-parameter --name /orders/payments/api-key`.
- **Praxis (17, 18):** Ebenso `aws ssm delete-parameter --name /werkstatt/payments/api-key`.
- **Power Tuning (15):** Den Stack aus dem Serverless Application Repository löschst du in CloudFormation.

## Workshop und Folien

- Workshop: [„AWS Serverless mit Lambda, CDK und DynamoDB“](https://workshops.mikebild.dev/w/aws-serverless/remote/)
- Folien: [slides.mikebild.dev/introduction-aws-serverless](https://slides.mikebild.dev/introduction-aws-serverless.html)

## Archiv

Die erste Fassung von 2019 (CDK 0.21, JavaScript, Lerna, Yarn) liegt als Archiv unter [`legacy/2019/`](legacy/2019/), wird weder gebaut noch getestet und enthält statt echter Account- und Ressourcen-IDs nur Platzhalter.

## Lizenz

[MIT](LICENSE)
