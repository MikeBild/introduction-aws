import { validateToken, userPool } from '../routes/auth';
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
