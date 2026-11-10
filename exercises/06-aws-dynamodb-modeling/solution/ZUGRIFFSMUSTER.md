*English · [Deutsch](ZUGRIFFSMUSTER.de.md)*

# Access patterns: orders

Questions first, then keys. Every question is answered with `GetItem` or `Query` – never with `Scan`.

| # | Question | Input | Result | How often? | Key / index | Operation |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | What is the profile of customer 42? | customerId | 1 profile | on every login | `pk = CUSTOMER#42`, `sk = PROFILE` | GetItem |
| 2 | Which orders does customer 42 have, newest first? | customerId, limit | up to 20 orders | very often (account page) | `pk = CUSTOMER#42`, `begins_with(sk, ORDER#)` | Query, `ScanIndexForward: false` |
| 3 | Which orders does customer 42 have in October? | customerId, from, to | orders in the date range | occasionally | `pk = CUSTOMER#42`, `sk BETWEEN ORDER#2026-10-01 AND ORDER#2026-10-31~` | Query |
| 4 | What does order A7 look like? | orderId | 1 order | often (support, mail links) | GSI1: `gsi1pk = ORDER#A7` | Query on GSI1 |
| 5 | Which orders are still open, oldest first? | status | open orders | every 5 minutes (stock) | GSI2: `gsi2pk = STATUS#OPEN`, `gsi2sk = createdAt` | Query on GSI2 |

## Items

| Entity | pk | sk | gsi1pk | gsi2pk | gsi2sk |
| --- | --- | --- | --- | --- | --- |
| Customer | `CUSTOMER#42` | `PROFILE` | – | – | – |
| Order | `CUSTOMER#42` | `ORDER#2026-10-17#A7` | `ORDER#A7` | `STATUS#OPEN` (only while open) | `2026-10-17T09:30:00Z` |

## Decisions

- The date comes first in the sort key. This way a Query returns the orders sorted, and date ranges work with `BETWEEN`.
- GSI2 is a sparse index: only open orders carry `gsi2pk`. When an order is shipped, you remove the attribute and it disappears from the index.
- `STATUS#OPEN` is a single partition key. With very many open orders you spread it across shards, for example `STATUS#OPEN#3`.
