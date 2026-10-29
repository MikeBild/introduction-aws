# Zugriffsmuster: Bestellungen

Erst die Fragen, dann die Keys. Jede Frage wird mit `GetItem` oder `Query` beantwortet – nie mit `Scan`.

| # | Frage | Eingabe | Ergebnis | Wie oft? | Key / Index | Operation |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Wie lautet das Profil von Kunde 42? | customerId | 1 Profil | bei jedem Login | `pk = CUSTOMER#42`, `sk = PROFILE` | GetItem |
| 2 | Welche Bestellungen hat Kunde 42, neueste zuerst? | customerId, limit | bis 20 Bestellungen | sehr oft (Kontoseite) | `pk = CUSTOMER#42`, `begins_with(sk, ORDER#)` | Query, `ScanIndexForward: false` |
| 3 | Welche Bestellungen hat Kunde 42 im Oktober? | customerId, von, bis | Bestellungen im Zeitraum | gelegentlich | `pk = CUSTOMER#42`, `sk BETWEEN ORDER#2026-10-01 AND ORDER#2026-10-31~` | Query |
| 4 | Wie sieht Bestellung A7 aus? | orderId | 1 Bestellung | oft (Support, Mail-Links) | GSI1: `gsi1pk = ORDER#A7` | Query auf GSI1 |
| 5 | Welche Bestellungen sind noch offen, älteste zuerst? | Status | offene Bestellungen | alle 5 Minuten (Lager) | GSI2: `gsi2pk = STATUS#OPEN`, `gsi2sk = createdAt` | Query auf GSI2 |

## Items

| Entity | pk | sk | gsi1pk | gsi2pk | gsi2sk |
| --- | --- | --- | --- | --- | --- |
| Kunde | `CUSTOMER#42` | `PROFILE` | – | – | – |
| Bestellung | `CUSTOMER#42` | `ORDER#2026-10-17#A7` | `ORDER#A7` | `STATUS#OPEN` (nur solange offen) | `2026-10-17T09:30:00Z` |

## Entscheidungen

- Das Datum steht vorn im Sort Key. So liefert eine Query die Bestellungen sortiert und Zeiträume per `BETWEEN`.
- GSI2 ist ein Sparse Index: Nur offene Bestellungen tragen `gsi2pk`. Wird eine Bestellung versendet, entfernst du das Attribut, und sie verschwindet aus dem Index.
- `STATUS#OPEN` ist ein einzelner Partition Key. Bei sehr vielen offenen Bestellungen verteilst du ihn auf Shards, etwa `STATUS#OPEN#3`.
