# 02 · Lambda Handler in TypeScript

**Unit:** `aws-lambda-handler`

## Aufgabe

Schreib einen async Handler in TypeScript, der eine Bestellung als JSON entgegennimmt, mit zod prüft und lokal per Unit Test ohne AWS läuft.

## Ablauf

1. Lies [`start/src/handler.ts`](start/src/handler.ts). Die Fachlogik steckt direkt im Handler und vertraut dem Body blind.
2. Beschreib die Bestellung in [`start/src/order.ts`](start/src/order.ts) als zod-Schema `Order`: `customerId` als String, `items` mit mindestens einem Eintrag aus `sku`, `price` und `quantity`.
3. Zieh die Summenberechnung in die reine Function `calculateTotal(order)`. Sie kennt weder Event noch AWS.
4. Lass den Handler nur noch parsen, prüfen und antworten: `400` mit den zod-Issues bei ungültigem Body, sonst `200` mit der Summe.
5. Entferne in `start/test/*.test.ts` das `.skip` und lass die Tests laufen.

```bash
npx vitest --project start exercises/02-aws-lambda-handler
```

## Prüfen

- Alle Tests grün, ohne AWS-Konto und ohne Netzwerk.
- `calculateTotal` lässt sich ohne Event aufrufen.

## Lösung

[`solution/`](solution/) – `npx vitest run --project solution exercises/02-aws-lambda-handler`
