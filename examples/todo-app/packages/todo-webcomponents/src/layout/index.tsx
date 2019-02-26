import * as React from 'react';
import { Fragment, StatelessComponent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  CssBaseline,
  withStyles,
  WithStyles,
  createStyles,
} from '@material-ui/core';

type TProps = {
  name: string;
  version: string;
  renderLinks: () => JSX.Element;
  renderUser: () => JSX.Element;
} & WithStyles<typeof styles>;

export const Layout: StatelessComponent<TProps> = ({
  children,
  name,
  version,
  classes,
  renderLinks,
  renderUser,
}) => {
  return (
    <Fragment>
      <CssBaseline />
      <header>
        <AppBar position='static' title='Brand'>
          <Toolbar>
            <Typography variant='h6' color='inherit' className={classes.grow}>
              {name.toUpperCase()} {version}
            </Typography>
            {renderLinks()}
            {renderUser()}
          </Toolbar>
        </AppBar>
      </header>
      <main>
        <Paper square className={classes.main}>
          {children}
        </Paper>
      </main>
    </Fragment>
  );
};

const styles = createStyles({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    width: '100vw',
    height: '100vh',
  },
});

export default withStyles(styles)(Layout);
