import React, { Fragment, StatelessComponent } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

type TProps = {
  name: string;
  version: string;
} & WithStyles<typeof styles>;

export const Layout: StatelessComponent<TProps> = ({
  children,
  name,
  version,
  classes,
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
            <Button href='home' color='inherit'>
              Home
            </Button>
            <Button href='about' color='inherit'>
              About
            </Button>
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
  root:
    {
      flexGrow: 1,
    },
  grow:
    {
      flexGrow: 1,
    },
  main:
    {
      width: '100vw',
      height: '100vh',
      padding: 20,
    },
});

export default withStyles(styles)(Layout);
