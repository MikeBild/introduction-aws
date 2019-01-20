import * as React from 'react'
import { FunctionComponent, Fragment } from 'react';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

type TProps = {
  children: Array<JSX.Element> | JSX.Element;
  name?: string;
  version?: string;
};

export const Layout: FunctionComponent<TProps> = ({
  children,
  name,
  version,
}) => {
  return (
    <Fragment>
      <CssBaseline />
      <header>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' color='inherit'>
              {name}:{version}
            </Typography>
          </Toolbar>
        </AppBar>
      </header>
      <main>
        <Paper square>{children}</Paper>
      </main>
    </Fragment>
  );
};

export default Layout;