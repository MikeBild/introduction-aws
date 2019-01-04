import React, { Fragment, StatelessComponent } from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useFetch from '../lib/useFetch';

type TProps = {} & WithStyles<typeof styles>;

export const Home: StatelessComponent<TProps> = () => {
  const { data = [], loading = false, error } = useFetch(
    `https://xrtbumqy1m.execute-api.eu-central-1.amazonaws.com/prod/todos`
  );

  return (
    <Fragment>
      <Typography variant='h6' color='inherit'>
        Home
      </Typography>
      <pre>{JSON.stringify({ data, loading, error }, null, 4)}</pre>
    </Fragment>
  );
};

const styles = createStyles({});

export default withStyles(styles)(Home);
