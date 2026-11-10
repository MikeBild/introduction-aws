*English · [Deutsch](README.de.md)*

# 02 · Lambda handler in TypeScript

**ID:** `aws-lambda-handler`

## Task

Write an async handler for `placeOrder`: validate the body, calculate the total in a Pure Function, respond with `400` or `200` and test it locally without AWS. You need no library for this, a small function is enough.

## Steps

1. Read [`start/src/handler.ts`](start/src/handler.ts). The business logic sits directly in the handler and trusts the body blindly.
2. In [`start/src/order.ts`](start/src/order.ts), write the function `parseOrder(body)`. It returns an `Order` or `undefined`:
   - broken JSON → `undefined`, no exception
   - `customerId` is a non-empty string
   - `items` has at least one line item made of `productId`, `quantity` (integer, at least 1) and `priceCents` (integer, at least 0)
3. Write the Pure Function `totalCents(order)`: the sum of quantity times price in cents. It knows neither the event nor AWS.
4. Let the handler only parse, validate and respond: `400` with `{ "message": "invalid order" }`, otherwise `200` with `{ "totalCents": … }`.
5. Remove the `.skip` in `start/test/*.test.ts` and run the tests:

   ```bash
   npx vitest --project start exercises/02-aws-lambda-handler
   ```

## Check

- All tests green, without an AWS account and without a network.
- `totalCents` can be called without an event.
- Money stays in whole cents: `parseOrder` rejects `12.99` as a price.

## Solution

[`solution/`](solution/) – `npx vitest run --project solution exercises/02-aws-lambda-handler`
