# 15 · Cold Starts messen und senken

**ID:** `aws-cold-starts`

## Aufgabe

Miss die Init Duration deiner Function, verkleinere das Bundle und vergleich 512, 1024 und 1769 MB Memory mit AWS Lambda Power Tuning.

## Ablauf

1. Miss lokal, wie groß das Bundle von [`start/src/heavy.ts`](start/src/heavy.ts) ist:

   ```bash
   cd exercises/15-aws-cold-starts/start
   node src/bundle-size.ts
   ```

2. Schreib [`start/src/lean.ts`](start/src/lean.ts): nur ein SDK-Client, gezielte Imports, keine Bibliothek für eine Prüfung, die drei Zeilen braucht.
3. Ergänze die Function `Lean` in [`start/lib/cold-starts-stack.ts`](start/lib/cold-starts-stack.ts) – SDK als external, minifiziert. Miss erneut mit `node src/bundle-size.ts`.
4. Implementier `parseReport` und `summarize` in [`start/src/report.ts`](start/src/report.ts) und entferne das `.skip` in den Tests.
5. Deploy, ruf beide Functions einige Male auf und werte die Logs aus. Jede neue Konfiguration erzwingt einen Cold Start:

   ```bash
   npx cdk deploy
   for i in 1 2 3 4 5; do
     aws lambda invoke --function-name <HeavyArn> --cli-binary-format raw-in-base64-out --payload '{"orderId":"A7"}' /dev/null
     aws lambda invoke --function-name <LeanArn>  --cli-binary-format raw-in-base64-out --payload '{"orderId":"A7"}' /dev/null
   done
   aws logs filter-log-events --log-group-name /aws/lambda/<Heavy-Name> --filter-pattern REPORT \
     --query 'events[].message' --output text | node src/analyze-logs.ts
   ```

6. Memory vergleichen mit [AWS Lambda Power Tuning](https://github.com/alexcasalboni/aws-lambda-power-tuning): Deploy es einmal aus dem Serverless Application Repository (Console → „Serverless Application Repository“ → `aws-lambda-power-tuning`). Trag in [`start/power-tuning-input.json`](start/power-tuning-input.json) die ARN ein und starte die State Machine:

   ```bash
   aws stepfunctions start-execution --state-machine-arn <powerTuningStateMachine> \
     --input file://power-tuning-input.json
   ```

   Das Ergebnis enthält einen Link auf ein Diagramm mit Kosten und Laufzeit pro Memory-Stufe.

## Prüfen

- Das schlanke Bundle ist mindestens zehnmal kleiner. Lokal prüft das der Test `bundle-size.test.ts`.
- Die Init Duration von `Lean` liegt deutlich unter der von `Heavy`.
- Ab 1769 MB hat die Function eine volle vCPU. Darüber sinkt die Laufzeit nur noch, wenn dein Code mehrere Threads nutzt.

## Zum Weiterdenken

- Provisioned Concurrency hält Environments warm – gegen Geld, auch ohne Requests.
- `cdk deploy -c memorySize=1769` ändert Memory ohne Codeänderung.

## Lösung

[`solution/`](solution/)
