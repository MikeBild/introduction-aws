# Arbeitsblatt: Was betreibt dein Team selbst?

Anwendung: _______________________

## Bausteine

| Baustein | Heute betrieben als | Wer betreibt ihn? | Was geht nachts schief? | Managed Service | Entscheidung |
| --- | --- | --- | --- | --- | --- |
| Auth / Login | | | | | |
| API | | | | | |
| Fachlogik | | | | | |
| Datenbank | | | | | |
| Hintergrund-Jobs, Cron | | | | | |
| Abläufe über mehrere Schritte | | | | | |
| Nachrichten zwischen Services | | | | | |
| Mail-Versand und -Empfang | | | | | |
| Logs, Metriken, Tracing | | | | | |

## Skizze

Zeichne die Bausteine und ihre Verbindungen. Färbe alles, was ein Managed Service übernehmen kann.

```mermaid
flowchart LR
  client["Client"] --> api["API"]
  api --> logic["Fachlogik"]
  logic --> db["Datenbank"]
```

## Fragen für die Diskussion

- Welcher Baustein kostet dein Team heute am meisten Betriebszeit?
- Wo braucht dein Team Kontrolle, die ein Managed Service nicht bietet?
- Wofür zahlt dein Team heute, auch wenn niemand die Anwendung nutzt?
