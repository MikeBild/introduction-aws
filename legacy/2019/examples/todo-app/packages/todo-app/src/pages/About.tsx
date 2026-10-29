import * as React from 'react';
import { StatelessComponent } from 'react';
import {
  Typography,
  Paper,
  Divider,
  withStyles,
  WithStyles,
  createStyles,
} from '@material-ui/core';

interface TProps {}

export const About: StatelessComponent<TProps & WithStyles<typeof styles>> = ({
  classes,
}) => (
  <Paper>
    <Typography variant='h5' component='h3' className={classes.root}>
      About
    </Typography>
    <Divider />
    <Typography component='p' className={classes.root}>
      This is an example application to demonstrate cloud development via
      AWS-CDK.
    </Typography>
  </Paper>
);

const styles = createStyles({
  root: {
    height: '100%',
    padding: 20,
  },
  content: {
    paddingTop: 20,
  },
});

export default withStyles(styles)(About);
