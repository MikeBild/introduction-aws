import React, { Fragment, StatelessComponent } from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

type TProps = {} & WithStyles<typeof styles>;

export const About: StatelessComponent<TProps> = ({ classes }) => (
  <Fragment>
    <Typography variant='h6' color='inherit'>
      About
    </Typography>
  </Fragment>
);

const styles = createStyles({});

export default withStyles(styles)(About);
