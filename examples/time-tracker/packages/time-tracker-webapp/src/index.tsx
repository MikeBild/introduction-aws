import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Home from './pages/Home';
import { name, version } from '../package.json';
import Layout from './templates/Layout';

const client = new ApolloClient({
  uri: process.env.GRAPHQL_URL,
});

const App = () => (
  <ApolloProvider client={client}>
    <Layout name={name} version={version}>
      <Home />
    </Layout>
  </ApolloProvider>
);

render(<App />, document.getElementById('app'));
