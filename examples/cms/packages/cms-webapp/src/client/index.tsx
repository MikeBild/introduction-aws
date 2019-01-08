import React, { Fragment } from 'react';
import { render } from 'react-dom';

declare let global: { GRAPHQL_URL: string; GRAPHQL_APIKEY: string };

const App = () => (
  <Fragment>
    <h1>Hello World</h1>
    {global.GRAPHQL_URL}
    {global.GRAPHQL_APIKEY}
  </Fragment>
);

render(<App />, document.getElementById('app'));
