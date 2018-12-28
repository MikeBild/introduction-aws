import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Home from './pages/Home';
import { name, version } from '../package.json';

const client = new ApolloClient({
  uri: process.env.GRAPHQL_URL,
});

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h1>
        Time Tracker ({name}:{version})
      </h1>
      <Home />
    </div>
  </ApolloProvider>
);

render(<App />, document.getElementById('app'));
