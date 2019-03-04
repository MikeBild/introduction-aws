import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const USER_POOL_ID = process.env.USER_POOL_ID || '';
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID || '';
const AWS_REGION = process.env.AWS_REGION || '';

export default () => async (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    const user = await validateToken({
      token,
      region: AWS_REGION,
      userPoolId: userPool.getUserPoolId(),
    });
    req.user = { username: user.email, email: user.email, id: user.sub };
    next();
  } catch (e) {
    res.sendStatus(401);
  }
};

export const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: USER_POOL_CLIENT_ID,
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
