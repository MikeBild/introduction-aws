# 03 · CDK-Grundlagen

**ID:** `aws-cdk-basics`

## Aufgabe

Leg mit `cdk init` ein TypeScript-Projekt an, ergänze eine `NodejsFunction` und eine `TableV2` und prüf die Änderungen mit `cdk diff` vor dem Deploy.

## Ablauf

1. Optional, um `cdk init` einmal selbst zu erleben – in einem leeren Ordner außerhalb dieses Repos:

   ```bash
   mkdir orders && cd orders
   npx aws-cdk@latest init app --language typescript
   ```

   Danach arbeitest du hier weiter: [`start/`](start/) enthält denselben leeren Stack, schon auf ESM, Node.js 26 und dieses Repo eingestellt.
2. Ergänze in [`start/lib/orders-stack.ts`](start/lib/orders-stack.ts) eine `TableV2` mit Partition Key `pk`.
3. Ergänze eine `NodejsFunction` für [`start/src/place-order.ts`](start/src/place-order.ts) mit `Runtime.NODEJS_24_X` und `Architecture.ARM_64`.
4. Gib der Function mit `table.grantReadWriteData(placeOrder)` Zugriff.
5. Prüf das Template lokal und dann gegen dein Konto:

   ```bash
   cd exercises/03-aws-cdk-basics/start
   npx cdk synth                 # Template lokal erzeugen
   npx cdk diff                  # Änderungen gegen den deployten Stack
   npx cdk deploy                # erst nach dem Lesen des Diffs
   npx cdk destroy               # am Ende aufräumen
   ```

6. Entferne das `.skip` in [`start/test/orders-stack.test.ts`](start/test/orders-stack.test.ts) und prüf den Stack per Assertions.

## Prüfen

- `cdk diff` zeigt Table, Function, Role und Policy – und sonst nichts.
- Im IAM-Teil des Diffs stehen nur DynamoDB-Aktionen auf genau diese Table.

## Lösung

[`solution/`](solution/)
