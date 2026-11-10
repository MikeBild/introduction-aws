const AuthApi = require('@introduction-aws/todo-gatsby-graphql-auth/auth-api');

exports.onPreInit = async () => {
  const auth = new AuthApi({ url: process.env.AUTH_API_URL });
  const { token } = await auth.login({
    email: process.env.AUTH_API_EMAIL,
    password: process.env.AUTH_API_PASSWORD,
  });
  process.env.GATSBY_AUTH_JWT_TOKEN = token;
};
