import React from 'react';
import { Route } from 'react-router-dom';
import Layout from './templates/Layout';
import Home from './pages/Home';
import About from './pages/About';
import { name, version } from '../../package.json';

export default () => (
  <Layout name={name} version={version}>
    <Route exact={true} path='/' component={Home} />
    <Route exact={true} path='/about' component={About} />
  </Layout>
);
