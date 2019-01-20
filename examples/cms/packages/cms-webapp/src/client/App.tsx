import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Client, { AUTH_TYPE } from 'aws-appsync';
import { ApolloProvider } from 'react-apollo';
import Home from './pages/Home'
import About from './pages/About'

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

export default () => (
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/home" exact component={Home} />
        <Route path="/about" exact component={About} />
      </Switch>
    </Router>
  </ApolloProvider>
);