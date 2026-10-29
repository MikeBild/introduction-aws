const React = require('react');
const fetch = require('isomorphic-unfetch');
const sessionStorage = require('sessionstorage');
const localStorage = require('localStorage');
const { ApolloProvider } = require('react-apollo');
const { ApolloClient } = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { createHttpLink } = require('apollo-link-http');
const { SchemaLink } = require('apollo-link-schema');
const { setContext } = require('apollo-link-context');
const {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
  addSchemaLevelResolveFunction,
} = require('graphql-tools');

export const wrapRootElement = (
  { element },
  { schemaModules, uri, headers, credentials, fetchOptions }
) => {
  const authLink = setContext((_, { headers }) => {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token');
    const headersWithAuth = Object.assign({}, headers, {
      authorization: token,
    });
    return token ? { headers: headersWithAuth } : headers;
  });

  const jsSchemaModules = schemaModules.map(name =>
    require(`./.cache/${name}`)
  );
  const hasSchema = Boolean(jsSchemaModules.length);

  if (!hasSchema) return;

  const hasRemoteSchema = Boolean(jsSchemaModules.some(x => x.uri));

  const schema = makeExecutableSchema({
    typeDefs: jsSchemaModules.map(({ typeDefs }) => typeDefs).filter(Boolean),
    resolvers: jsSchemaModules
      .map(({ resolvers }) => resolvers)
      .filter(Boolean),
  });

  addSchemaLevelResolveFunction(schema, (parent, args, ctx, info) => {
    jsSchemaModules
      .map(module => module.context || {})
      .filter(Boolean)
      .forEach(context => Object.assign(ctx, context));
  });

  const schemas = hasRemoteSchema
    ? jsSchemaModules
        .filter(x => x.uri)
        .filter(Boolean)
        .map(x => {
          const link = authLink.concat(
            createHttpLink({
              uri: x.uri,
              headers,
              fetch,
            })
          );

          return makeRemoteExecutableSchema({
            schema,
            link,
          });
        })
    : [schema];

  const link = new SchemaLink({
    schema: mergeSchemas({ schemas }),
    context: { context: {} },
    rootValue: {},
  });
  const cache = new InMemoryCache();
  const client = new ApolloClient({ link, cache });

  return <ApolloProvider client={client}>{element}</ApolloProvider>;
};
