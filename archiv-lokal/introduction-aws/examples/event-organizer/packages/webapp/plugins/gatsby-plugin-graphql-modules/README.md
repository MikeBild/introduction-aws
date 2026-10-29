# Gatsby Modular GraphQL Source Plugin

> Gatsby source plugin which adds modularized third-party GraphQL schemas to Gatsby GraphQL with Apollo-Client side execution support.

## Conceptual thoughts

- Unified and frontend-driven way to define schemas, resolvers, context and data queries/mutations
- Adds local and remote third-party GraphQL schemas to the client-side and Gatsby GraphQL data sources
- Modularize and combine multiple local and remote GraphQL-Schemas into [One-Graph](https://principledgraphql.com/integrity#1-one-graph)

**Read more:**

- [Principled GraphQL](https://principledgraphql.com/integrity#1-one-graph)
- [Generating a schema](https://www.apollographql.com/docs/graphql-tools/generate-schema.html)
- [Resolvers](https://www.apollographql.com/docs/graphql-tools/resolvers.html)
- [Remote Schemas](https://www.apollographql.com/docs/graphql-tools/remote-schemas.html)
- [Schema stitching](https://www.apollographql.com/docs/graphql-tools/schema-stitching.html)

## Setup

`npm install gatsby-source-modular-graphql --save-dev`
`yarn add gatsby-source-modular-graphql --dev`

## How to use?

**`gatsby-config.js`**

```javascript
{
  resolve: 'gatsby-source-modular-graphql',
  options: {
    path: './graphql',
    schemaModules:
      process.env.NODE_ENV === 'remote'
        ? ['my-remote-schema']
        : ['my-local-schema'],
  },
}
```

## How to add a local schema?

**`./graphql/my-local-schema`**

```javascript
module.exports = {
  typeDefs: `
  type Query {
    todos: [Todo]
  }

  type Todo {
    id: ID!
    description: String
    done: Boolean
  }
  `,
  resolvers: {
    Query: {
      todos: (parent, args, { todos: { todosAll } }) => {
        return todosAll();
      },
    },
  },
  context: {
    todos: {
      todosAll: () => [
        { id: 1, description: 'A', done: false, modifiedAt: Date.now() },
        { id: 2, description: 'B', done: false, modifiedAt: Date.now() },
      ],
    },
  },
};
```

## How to add a remote schema?

**`./graphql/my-remote-schema`**

```javascript
module.exports = {
  uri: 'https://example.com/graphql',
  headers: {
    authorization: 'secret',
  },
  typeDefs: `
  type Query {
    todos: [Todo]
  }

  type Todo {
    id: ID!
    description: String
    done: Boolean
  }
  `,
};
```

## How to use in my Gatsby-Pages and React-Components?

- Statically using [StaticQuery](https://www.gatsbyjs.org/docs/static-query/)
- Dynamically using [Apollo-React Query](https://www.apollographql.com/docs/react/essentials/queries.html#basic) and [Apollo-React Muation](https://www.apollographql.com/docs/react/essentials/mutations.html#basic)
