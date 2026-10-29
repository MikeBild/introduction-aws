import * as React from 'react';
import Layout from '../components/layout';
import { Typography, Grid } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';

export const AboutPage = ({ classes }: WithStyles<typeof styles>) => (
  <Layout>
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item>
          <Typography variant='headline'>About</Typography>
          <Typography variant='body1'>Welcome</Typography>
        </Grid>
      </Grid>
    </div>
  </Layout>
);

const styles = () => ({
  root: {
    padding: 24,
  },
});

export default withStyles(styles)(AboutPage);
