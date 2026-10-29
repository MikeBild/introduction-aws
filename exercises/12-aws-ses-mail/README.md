# 12 · Mails mit SES

**ID:** `aws-ses-mail`

## Aufgabe

Verschick nach einer Bestellung eine Bestätigung per SES-Template und leg für eingehende Antworten eine Receipt Rule mit S3 und Lambda an.

## Vorher wissen

- **Sandbox:** Neue SES-Konten sind in der Sandbox. Du kannst nur an verifizierte Adressen schicken. Verifizier deshalb auch deine Empfangsadresse oder beantrage Production Access.
- **Empfang:** Eingehende Mails gehen nur in Regionen mit SES Email Receiving, etwa `eu-west-1` oder `us-east-1`. Prüf die aktuelle Liste in der SES-Doku. Du brauchst eine eigene Domain: Der Stack legt sie als Identity an, die DKIM-Einträge aus der SES Console trägst du in dein DNS ein, dazu einen MX-Eintrag auf `inbound-smtp.<region>.amazonaws.com`.
- **Rule Set aktivieren:** CloudFormation aktiviert kein Receipt Rule Set. Das machst du nach dem Deploy per CLI.

## Ablauf

1. Stell in [`start/src/send-confirmation.ts`](start/src/send-confirmation.ts) von `Content.Simple` auf `Content.Template` um.
2. Leg in [`start/lib/mail-stack.ts`](start/lib/mail-stack.ts) das `CfnTemplate` `order-confirmed` an und erlaub `ses:SendEmail` auf das Template.
3. Implementier `parseMail` in [`start/src/parse-mail.ts`](start/src/parse-mail.ts) und lade die Rohmail in [`start/src/inbound-mail.ts`](start/src/inbound-mail.ts) aus S3.
4. Ergänze Bucket, Funktion `InboundMail` und Receipt Rule mit `S3Action`, dann `LambdaAction`.
5. Entferne das `.skip` in den Tests.
6. Deploy mit deiner Domain und Absenderadresse:

   ```bash
   cd exercises/12-aws-ses-mail/start
   npx cdk deploy -c domain=deine-domain.de -c fromAddress=shop@deine-domain.de
   # Link in der Verifizierungs-Mail an shop@… anklicken, dann:
   aws ses set-active-receipt-rule-set --rule-set-name <ReceiptRuleSetName>
   aws lambda invoke --function-name <SendConfirmationName> --cli-binary-format raw-in-base64-out \
     --payload '{"id":"A7","email":"du@deine-domain.de","total":42}' out.json
   ```

7. Antworte auf die Bestätigung und sieh in den Logs von `InboundMail` nach.

## Prüfen

- Die Bestätigung kommt mit Betreff „Bestellung A7 bestätigt“ an, und Reply-To zeigt auf `reply@deine-domain.de`.
- Die Antwort liegt als Rohdatei in S3 unter `inbound/<Message-ID>`, und `InboundMail` loggt die `orderId`.

## Lösung

[`solution/`](solution/)
