import React from 'react';
import { render } from 'react-dom';
import Client, { AUTH_TYPE, AWSAppSyncClientOptions } from 'aws-appsync';
import { ApolloProvider, Query } from 'react-apollo';
import AllDocumentsQuery from './allDocumentsQuery.gql';

declare let global: {
  GRAPHQL_URL: string;
  GRAPHQL_APIKEY: string;
  AWS_REGION: string;
};

const client = new Client({
  disableOffline: true,
  url: global.GRAPHQL_URL,
  region: global.AWS_REGION,
  auth:
    {
      type: AUTH_TYPE.API_KEY,
      apiKey: global.GRAPHQL_APIKEY,
    },
});

const App = () => (
  <ApolloProvider client={client}>
    <h1>Hello World</h1>
    <Query query={AllDocumentsQuery}>
      {({ data: { articles }, loading, error }) => {
        if (loading) return <div>loading ...</div>;
        if (error) return <div>{error.message}</div>;

        return <pre>{JSON.stringify(articles, null, 2)}</pre>;
      }}
    </Query>
  </ApolloProvider>
);

render(<App />, document.getElementById('app'));
