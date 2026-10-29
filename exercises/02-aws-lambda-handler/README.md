# 02 · Lambda Handler in TypeScript

**Unit:** `aws-lambda-handler`

## Aufgabe

Schreib einen async Handler für `placeOrder`: Body prüfen, die Summe in einer reinen Function berechnen, mit `400` oder `200` antworten und lokal ohne AWS testen. Du brauchst dafür keine Bibliothek, eine kleine Funktion reicht.

## Ablauf

1. Lies [`start/src/handler.ts`](start/src/handler.ts). Die Fachlogik steckt direkt im Handler und vertraut dem Body blind.
2. Schreib in [`start/src/order.ts`](start/src/order.ts) die Funktion `parseOrder(body)`. Sie liefert eine `Order` oder `undefined`:
   - kaputtes JSON → `undefined`, keine Exception
   - `customerId` ist ein nicht leerer String
   - `items` hat mindestens eine Position aus `productId`, `quantity` (ganzzahlig, mindestens 1) und `priceCents` (ganzzahlig, mindestens 0)
3. Schreib die reine Function `totalCents(order)`: Summe aus Menge mal Preis in Cent. Sie kennt weder Event noch AWS.
4. Lass den Handler nur noch parsen, prüfen und antworten: `400` mit `{ "message": "invalid order" }`, sonst `200` mit `{ "totalCents": … }`.
5. Entferne in `start/test/*.test.ts` das `.skip` und lass die Tests laufen:

   ```bash
   npx vitest --project start exercises/02-aws-lambda-handler
   ```

## Prüfen

- Alle Tests grün, ohne AWS-Konto und ohne Netzwerk.
- `totalCents` lässt sich ohne Event aufrufen.
- Geld bleibt in ganzen Cent: `12.99` als Preis lehnt `parseOrder` ab.

## Lösung

[`solution/`](solution/) – `npx vitest run --project solution exercises/02-aws-lambda-handler`
