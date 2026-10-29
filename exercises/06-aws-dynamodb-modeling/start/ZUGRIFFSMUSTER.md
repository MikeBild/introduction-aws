# Zugriffsmuster: Bestellungen

Schreib fünf Fragen auf, die deine Anwendung an Bestellungen stellt. Leite erst danach Keys und Indexe ab.

| # | Frage | Eingabe | Ergebnis | Wie oft? | Key / Index | Operation |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

## Items

| Entity | pk | sk | weitere Key-Attribute |
| --- | --- | --- | --- |
| Kunde | | | |
| Bestellung | | | |

## Prüffragen

- Lässt sich jede Frage mit `GetItem` oder `Query` beantworten?
- Welche Frage braucht einen GSI, und welche Attribute projiziert er?
- Welcher Partition Key könnte heiß werden?
