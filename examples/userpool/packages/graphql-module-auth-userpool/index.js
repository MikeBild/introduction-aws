const AuthApi = require('./auth-api');

module.exports = {
  typeDefs: `
  type Mutation {
    login(input: LoginInput): LoginResult
  }

  input LoginInput {
    username: String
    password: String
  }

  type LoginResult {
    success: LoginSuccess
    failure: Failure
  }

  type LoginSuccess {
    token: String
  }

  type Failure {
    message: String
  }
  `,
  resolvers: {
    Mutation: {
      login: async (parent, { input: { username, password } }, { authApi }) => {
        try {
          const success = await authApi.login({ email: username, password });
          return {
            success,
            failure: null,
          };
        } catch (e) {
          console.error(e);
          return {
            success: null,
            failure: {
              message: e.message,
            },
          };
        }
      },
    },
  },
  context: {
    authApi: new AuthApi({ url: process.env.AUTH_API_URL }),
  },
};
