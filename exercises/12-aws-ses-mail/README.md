*English · [Deutsch](README.de.md)*

# 12 · Mail with SES

**ID:** `aws-ses-mail`

## Task

Send a confirmation via an SES template after an order and create a receipt rule with S3 and Lambda for incoming replies.

## Before you start

- **Sandbox:** New SES accounts are in the sandbox. You can only send to verified addresses. So verify your receiving address as well, or request production access.
- **Receiving:** Incoming mail only works in regions with SES Email Receiving, such as `eu-west-1` or `us-east-1`. Check the current list in the SES docs. You need your own domain: the stack creates it as an identity, you add the DKIM records from the SES console to your DNS, plus an MX record pointing to `inbound-smtp.<region>.amazonaws.com`.
- **Activate the rule set:** CloudFormation does not activate a receipt rule set. You do that after the deploy via the CLI.

## Steps

1. In [`start/src/send-confirmation.ts`](start/src/send-confirmation.ts), switch from `Content.Simple` to `Content.Template`.
2. In [`start/lib/mail-stack.ts`](start/lib/mail-stack.ts), create the `CfnTemplate` `order-confirmed` and allow `ses:SendEmail` on the template.
3. Implement `parseMail` in [`start/src/parse-mail.ts`](start/src/parse-mail.ts) and load the raw mail from S3 in [`start/src/inbound-mail.ts`](start/src/inbound-mail.ts).
4. Add the bucket, the function `InboundMail` and the receipt rule with `S3Action`, then `LambdaAction`.
5. Remove the `.skip` in the tests.
6. Deploy with your domain and sender address:

   ```bash
   cd exercises/12-aws-ses-mail/start
   npx cdk deploy -c domain=deine-domain.de -c fromAddress=shop@deine-domain.de
   # click the link in the verification mail to shop@…, then:
   aws ses set-active-receipt-rule-set --rule-set-name <ReceiptRuleSetName>
   aws lambda invoke --function-name <SendConfirmationName> --cli-binary-format raw-in-base64-out \
     --payload '{"id":"A7","email":"du@deine-domain.de","total":42}' out.json
   ```

7. Reply to the confirmation and look at the logs of `InboundMail`.

## Check

- The confirmation arrives with the subject “Bestellung A7 bestätigt”, and Reply-To points to `reply@deine-domain.de`.
- The reply is stored as a raw file in S3 under `inbound/<Message-ID>`, and `InboundMail` logs the `orderId`.

## Solution

[`solution/`](solution/)
