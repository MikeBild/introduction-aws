import React, { Fragment, StatelessComponent, useState } from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import useFetch from '../lib/useFetch';
import TodoInputDialog from '../organisms/TodoInputDialog';

type TProps = {} & WithStyles<typeof styles>;

export const Home: StatelessComponent<TProps> = ({ classes }) => {
  const [
    isAddTodoVisible,
    setIsAddTodoVisible,
  ] = useState(false);
  const { data = [], loading = false, error } = useFetch({
    url: `https://xrtbumqy1m.execute-api.eu-central-1.amazonaws.com/prod/todos`,
  });

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <Fab
        className={classes.fab}
        color='secondary'
        onClick={() => setIsAddTodoVisible(true)}>
        <AddIcon />
      </Fab>
      <TodoInputDialog
        isVisible={isAddTodoVisible}
        onCancel={() => setIsAddTodoVisible(false)}
        onDone={async (input) => {
          console.log({ input });
          await fetch(
            `https://xrtbumqy1m.execute-api.eu-central-1.amazonaws.com/prod/todos`,
            {
              method: 'POST',
              body: JSON.stringify(input),
              headers:
                {
                  'Content-Type': 'application/json',
                },
            }
          );
          setIsAddTodoVisible(false);
        }}
      />
      <Typography variant='h6' color='inherit'>
        Home
      </Typography>
      <pre>{JSON.stringify({ data, loading, error }, null, 4)}</pre>
    </Fragment>
  );
};

const styles = createStyles({
  fab:
    {
      position: 'absolute',
      top: 50,
      right: 40,
    },
});

export default withStyles(styles)(Home);
