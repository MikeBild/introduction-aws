const todos = require('./todos.json');

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
    Todo: {
      modifiedAt: (parent, args, context) => {
        return Date.now();
      },
    },
    Query: {
      todos: (parent, args, { context: { todos } }) => {
        return todos.todosAll();
      },
    },
  },
  context: {
    todos: {
      todosAll: async () => todos,
    },
  },
};
