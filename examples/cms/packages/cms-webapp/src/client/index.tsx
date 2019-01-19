import React from 'react';
import { render } from 'react-dom';
import Client, { AUTH_TYPE } from 'aws-appsync';
import { ApolloProvider } from 'react-apollo';
import Home from './pages/Home'

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
    <Home />
  </ApolloProvider>
);

render(<App />, document.getElementById('app'));
