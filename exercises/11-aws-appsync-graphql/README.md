# 11 · GraphQL mit AppSync

**Unit:** `aws-appsync-graphql`

## Aufgabe

Bau eine AppSync API mit Query `order`, Mutation `createOrder` und Subscription `onOrderCreated`. Schreib beide Resolver in JavaScript.

## Ablauf

1. [`start/`](start/) enthält User Pool, Table und eine API mit `Query.order` samt Resolver [`get-order.js`](start/resolvers/get-order.js).
2. Ergänze in [`start/schema.graphql`](start/schema.graphql) `CreateOrderInput`, `Mutation.createOrder` und `Subscription.onOrderCreated` mit `@aws_subscribe`.
3. Schreib den Resolver [`start/resolvers/create-order.js`](start/resolvers/create-order.js) mit `ddb.put` aus `@aws-appsync/utils/dynamodb`. Die `ownerId` kommt aus `ctx.identity.sub`.
4. Häng ihn in [`start/lib/orders-graphql-stack.ts`](start/lib/orders-graphql-stack.ts) per `createResolver` an `Mutation.createOrder`.
5. Entferne das `.skip` in den Tests. Sie ersetzen die AppSync-Runtime durch Mocks und prüfen nur die Logik deiner Resolver.
6. Deploy, leg einen Nutzer an (siehe Lektion 09) und teste in der AppSync Console unter „Queries“ – dort meldest du dich mit dem User Pool an:

   ```graphql
   subscription { onOrderCreated { id ownerId createdAt } }      # in einem zweiten Tab starten
   mutation { createOrder(input: { items: [{ sku: "BOOK", quantity: 2 }] }) { id ownerId } }
   query { order(id: "<id aus der Mutation>") { id items { sku quantity } } }
   ```

## Prüfen

- Die Subscription im zweiten Tab zeigt jede neue Bestellung sofort an.
- `order` liefert `null` für Bestellungen eines anderen Nutzers.
- Der Resolver läuft ohne Lambda: AppSync spricht DynamoDB direkt an.

## Zum Weiterdenken

Muss ein Resolver drei Services aufrufen und Ergebnisse zusammenführen, gehört die Logik in eine Lambda Function als Data Source: `api.addLambdaDataSource(...)`.

## Lösung

[`solution/`](solution/)
