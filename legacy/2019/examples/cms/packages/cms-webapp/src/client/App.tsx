import * as React from 'react';
import { Fragment } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom'
import Client, { AUTH_TYPE } from 'aws-appsync';
import { ApolloProvider } from 'react-apollo';
import Layout from '@introduction-aws/layout'
import { name, version } from '../../package.json';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Articles from './pages/Articles';

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
  <Router>
    <Layout name={name} version={version} renderNav={() => {
      return (
        <Fragment>
          <Button component={Link} {...{ to: "/" }} color='inherit'>
            Home
          </Button>
          <Button component={Link} {...{ to: "/articles" }} color='inherit'>
            Articles
          </Button>
          <Button component={Link} {...{ to: "/about" }} color='inherit'>
            About
          </Button>
        </Fragment>
      )
    }}>
      <ApolloProvider client={client}>
        <Route path="/" exact component={Home} />
        <Route path="/articles" exact component={Articles} />
        <Route path="/about" exact component={About} />
      </ApolloProvider>
    </Layout>
  </Router>
);