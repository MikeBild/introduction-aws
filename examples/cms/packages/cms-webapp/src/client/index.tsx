import React, { Fragment } from 'react';
import { render } from 'react-dom';

declare let global: { GQL_URL: string; GQL_APIKEY: string };

const App = () => (
  <Fragment>
    <h1>Hello World</h1>
    {global.GQL_URL}
    {global.GQL_APIKEY}
  </Fragment>
);

render(<App />, document.getElementById('app'));
