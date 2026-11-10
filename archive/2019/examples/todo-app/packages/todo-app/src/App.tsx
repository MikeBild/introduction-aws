import 'isomorphic-fetch';
import 'abortcontroller-polyfill';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import * as React from 'react';
import { name, version } from '../package.json';
import { Route, Redirect } from 'react-router-dom';
import AppContext, { Consumer } from './lib/appContext';
import { Button, Typography } from '@material-ui/core';
import { Layout } from '@introduction-aws/todo-webcomponents';
import Todos from './pages/Todos';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Confirm from './pages/Confirm';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      {context => (
        <Route
          {...rest}
          render={props => {
            const user = context.user.get();
            return user && user.token ? (
              <Component {...props} context={context} />
            ) : (
              <Redirect to='/login' />
            );
          }}
        />
      )}
    </Consumer>
  );
};

export default () => (
  <AppContext>
    <Route exact={true} path='/login' component={Login} />
    <Route exact={true} path='/signup' component={Signup} />
    <Route exact={true} path='/confirm' component={Confirm} />
    <Consumer>
      {context => {
        const currentUser = context.user.get();
        return (
          <Layout
            name={name}
            version={version}
            renderLinks={() => (
              <>
                <Button href='/todos' color='inherit'>
                  Todos
                </Button>
                <Button href='/about' color='inherit'>
                  About
                </Button>
                {currentUser && currentUser.token && (
                  <Button
                    href='/login'
                    color='inherit'
                    onClick={context.user.reset}>
                    Logout
                  </Button>
                )}
              </>
            )}
            renderUser={() => (
              <Typography variant='body1' gutterBottom color='inherit'>
                {currentUser.username}
              </Typography>
            )}>
            <Route exact={true} path='/about' component={About} />
            <PrivateRoute
              exact={true}
              path='/'
              component={Todos}
              context={context}
            />
            <PrivateRoute
              exact={true}
              path='/todos'
              component={Todos}
              context={context}
            />
          </Layout>
        );
      }}
    </Consumer>
  </AppContext>
);
