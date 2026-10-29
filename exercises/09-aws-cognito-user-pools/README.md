# 09 · Cognito User Pools

**Unit:** `aws-cognito-user-pools`

## Aufgabe

Leg einen User Pool mit E-Mail-Login und einen App Client ohne Secret an, registriere einen Testnutzer und dekodiere ID Token und Access Token.

## Ablauf

1. Ergänze User Pool und App Client in [`start/lib/users-stack.ts`](start/lib/users-stack.ts) und deploy:

   ```bash
   cd exercises/09-aws-cognito-user-pools/start
   npx cdk deploy
   POOL=<UserPoolId>; CLIENT=<ClientId>
   ```

2. Registriere einen Testnutzer. Nimm eine Adresse, deren Postfach du lesen kannst – Cognito schickt den Code dorthin:

   ```bash
   aws cognito-idp sign-up --client-id $CLIENT \
     --username du@example.com --password 'Ein-langes-Passwort-26'
   aws cognito-idp confirm-sign-up --client-id $CLIENT \
     --username du@example.com --confirmation-code 123456
   ```

   Ohne Postfach bestätigst du den Nutzer als Admin: `aws cognito-idp admin-confirm-sign-up --user-pool-id $POOL --username du@example.com`.
3. Meld dich an und hol die Tokens:

   ```bash
   aws cognito-idp initiate-auth --client-id $CLIENT --auth-flow USER_PASSWORD_AUTH \
     --auth-parameters USERNAME=du@example.com,PASSWORD='Ein-langes-Passwort-26' \
     --query AuthenticationResult > tokens.json
   ```

4. Implementiere `decodeJwt` in [`start/src/jwt.ts`](start/src/jwt.ts) und dekodiere beide Tokens:

   ```bash
   node src/decode-token.ts "$(jq -r .IdToken tokens.json)"
   node src/decode-token.ts "$(jq -r .AccessToken tokens.json)"
   ```

5. Entferne das `.skip` in den Tests.

## Prüfen

- Das ID Token hat `token_use: id`, `aud` und `email` – es beschreibt den Nutzer für dein Frontend.
- Das Access Token hat `token_use: access`, `client_id` und `scope` – es geht an deine API.

Im Browser nutzt du statt `USER_PASSWORD_AUTH` den SRP-Flow, etwa mit `aws-amplify/auth`. Dann schaltest du `userPassword` im Client wieder ab.

## Lösung

[`solution/`](solution/)
