import * as React from 'react';
import { Link } from 'gatsby';
import { Button, AppBar, Typography, Toolbar } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

interface TProps {
  siteTitle?: string;
}

const Header = ({
  siteTitle = '',
  classes,
}: TProps & WithStyles<typeof styles>) => (
  <header>
    <AppBar position='static' className={classes.appBar}>
      <Toolbar>
        <Typography
          variant='h6'
          color='inherit'
          noWrap
          className={classes.title}>
          {siteTitle}
        </Typography>
        <Button component={Link} to='/' color='secondary'>
          Events
        </Button>
        <Button component={Link} to='/about' color='secondary'>
          About
        </Button>
      </Toolbar>
    </AppBar>
  </header>
);
const styles = () => ({
  appBar: {
    backgroundColor: 'black',
  },
  title: {
    fontWeight: 700,
    flexGrow: 1,
  },
});

export default withStyles(styles)(Header);
