import express from 'express';
import aws from 'aws-sdk';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  ISignUpResult,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

const USER_POOL_ID = process.env.USER_POOL_ID || '';
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID || '';
const AWS_REGION = process.env.AWS_REGION || '';
const DEFAULT_USER_GROUP = process.env.DEFAULT_USER_GROUP || '';
aws.config.region = AWS_REGION;

export const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: USER_POOL_CLIENT_ID,
});

const app = express.Router();

export default app;

app.post('/signup', (req, res, next) => {
  const input = { ...req.body };
  if (input.password !== input.confirm)
    return next(new Error('Could not confirm password'));

  userPool.signUp(
    input.username,
    input.password,
    [new CognitoUserAttribute({ Name: 'email', Value: input.username })],
    [],
    async (e: Error | undefined, result: ISignUpResult | undefined) => {
      if (e) return next(e);

      const username = (result && result.user.getUsername()) || input.username;

      // const p = new aws.CognitoIdentityServiceProvider();
      // await p
      //   .adminAddUserToGroup({
      //     GroupName: DEFAULT_USER_GROUP,
      //     Username: username,
      //     UserPoolId: userPool.getUserPoolId(),
      //   })
      //   .promise();

      res.status(201).send({ username });
    }
  );
});

app.post('/confirm', async (req, res, next) => {
  const input = { ...req.body };
  try {
    const cognitoUser = new CognitoUser({
      Username: input.username,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(
      input.code,
      true,
      (e: Error | undefined, result: string | undefined) => {
        if (e) return next(e);
        if (result !== 'SUCCESS') return next(new Error('Confirmation failed'));

        res.send({});
      }
    );
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.post('/validate', async (req, res, next) => {
  const input = { ...req.body };
  try {
    const validation = await validateToken({
      token: input.token,
      region: AWS_REGION,
      userPoolId: userPool.getUserPoolId(),
    });
    res.send(validation);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.post('/login', (req, res, next) => {
  const input = { ...req.body };
  try {
    const cognitoUser = new CognitoUser({
      Username: input.username,
      Pool: userPool,
    });
    cognitoUser.authenticateUser(
      new AuthenticationDetails({
        Username: input.username,
        Password: input.password,
      }),
      {
        onSuccess(result) {
          const idToken = result.getIdToken();

          res.send({
            token: idToken.getJwtToken(),
            username: idToken.payload.email,
            email: idToken.payload.email,
          });
        },
        onFailure(e: Error) {
          next(e);
        },
      }
    );
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export async function validateToken({
  token,
  region,
  userPoolId,
}: {
  token: string;
  region: string;
  userPoolId: string;
}) {
  const response = await fetch(
    `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
  );
  const body: any = await response.json();
  const pems: any = {};
  const keys = body['keys'];

  for (let i = 0; i < keys.length; i++) {
    const key_id = keys[i].kid;
    const modulus = keys[i].n;
    const exponent = keys[i].e;
    const key_type = keys[i].kty;
    const jwk = { kty: key_type, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);
    pems[key_id] = pem;
  }

  const decodedJwt = jwt.decode(token, { complete: true });
  if (!decodedJwt) throw new Error('Invalid JWT');

  const kid = decodedJwt.header.kid;
  const pem = pems[kid];
  if (!pem) throw new Error('Invalid JWT');

  return new Promise((resolve, reject) => {
    jwt.verify(token, pem, (err: any, payload: any) => {
      if (err) return reject(new Error('Invalid JWT'));
      resolve(payload);
    });
  });
}
