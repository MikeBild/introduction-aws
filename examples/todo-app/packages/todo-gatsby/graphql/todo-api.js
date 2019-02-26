module.exports = {
  typeDefs: `
  type Query {
    todos(filter: TodosFilter): [Todo] @aws_auth(cognito_groups: ["Users"])
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
  resolvers: {
    Query: {
      todos: () => {
        return [
          { id: 1, description: 'A', done: false, modifiedAt: Date.now() },
          { id: 2, description: 'B', done: false, modifiedAt: Date.now() },
          { id: 3, description: 'C', done: false, modifiedAt: Date.now() },
        ];
      },
    },
  },
};
