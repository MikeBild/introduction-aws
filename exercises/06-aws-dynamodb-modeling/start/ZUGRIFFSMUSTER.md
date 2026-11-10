*English · [Deutsch](ZUGRIFFSMUSTER.de.md)*

# Access patterns: orders

Write down five questions your application asks about orders. Only then derive keys and indexes.

| # | Question | Input | Result | How often? | Key / index | Operation |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

## Items

| Entity | pk | sk | further key attributes |
| --- | --- | --- | --- |
| Customer | | | |
| Order | | | |

## Check questions

- Can every question be answered with `GetItem` or `Query`?
- Which question needs a GSI, and which attributes does it project?
- Which partition key could become hot?
