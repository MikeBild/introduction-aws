module.exports = {
  uri: process.env.TODOS_API_URL,
  headers: {
    authorization: process.env.TODOS_API_JWT_TOKEN,
  },
  typeDefs: `
  schema {
    query: Query
  }

  type Query {
    todos(filter: TodosFilter): [Todo] @aws_auth(cognito_groups : ["Users"])
  }

  type Todo {
    createdAt: AWSDateTime
    description: String
    done: Boolean
    id: ID!
    modifiedAt: AWSDateTime
    username: ID
  }

  input TodosFilter {
    description: String
    done: Boolean
  }
  `,
};
