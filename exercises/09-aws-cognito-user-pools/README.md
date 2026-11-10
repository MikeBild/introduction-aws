*English · [Deutsch](README.de.md)*

# 09 · Cognito User Pools

**ID:** `aws-cognito-user-pools` · additional chapter

## Task

Create a user pool with email login and an app client without a secret, register a test user and decode the ID token and the access token.

## Steps

1. Add the user pool and the app client in [`start/lib/users-stack.ts`](start/lib/users-stack.ts) and deploy:

   ```bash
   cd exercises/09-aws-cognito-user-pools/start
   npx cdk deploy
   POOL=<UserPoolId>; CLIENT=<ClientId>
   ```

2. Register a test user. Use an address whose inbox you can read – Cognito sends the code there:

   ```bash
   aws cognito-idp sign-up --client-id $CLIENT \
     --username du@example.com --password 'Ein-langes-Passwort-26'
   aws cognito-idp confirm-sign-up --client-id $CLIENT \
     --username du@example.com --confirmation-code 123456
   ```

   Without an inbox you confirm the account as admin: `aws cognito-idp admin-confirm-sign-up --user-pool-id $POOL --username du@example.com`.
3. Sign in and get the tokens:

   ```bash
   aws cognito-idp initiate-auth --client-id $CLIENT --auth-flow USER_PASSWORD_AUTH \
     --auth-parameters USERNAME=du@example.com,PASSWORD='Ein-langes-Passwort-26' \
     --query AuthenticationResult > tokens.json
   ```

4. Implement `decodeJwt` in [`start/src/jwt.ts`](start/src/jwt.ts) and decode both tokens:

   ```bash
   node src/decode-token.ts "$(jq -r .IdToken tokens.json)"
   node src/decode-token.ts "$(jq -r .AccessToken tokens.json)"
   ```

5. Remove the `.skip` in the tests.

## Check

- The ID token has `token_use: id`, `aud` and `email` – it describes the signed-in person for your frontend.
- The access token has `token_use: access`, `client_id` and `scope` – it goes to your API.

In the browser you use the SRP flow instead of `USER_PASSWORD_AUTH`, for example with `aws-amplify/auth`. Then you switch `userPassword` off again in the client.

## Solution

[`solution/`](solution/)
