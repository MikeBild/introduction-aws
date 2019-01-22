import React, { Fragment, StatelessComponent, useState } from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { LinearProgress, Fab, Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CachedIcon from '@material-ui/icons/Cached';
import useFetch from '../lib/useFetch';
import TodoInputDialog from '../organisms/TodoInputDialog';
import { List } from '@introduction-aws/todo-webcomponents';
import { add, remove, toggleDone, Todo } from '../lib/api-todos'

type TProps = {} & WithStyles<typeof styles>;

export const Home: StatelessComponent<TProps> = ({ classes }) => {
  const [
    isAddTodoVisible,
    setIsAddTodoVisible,
  ] = useState(false);

  const { data = [], loading = false, error, refetch } = useFetch({
    url: `${global.API_URL || ''}/todos`,
  });

  return (
    <Fragment>
      {loading && <LinearProgress />}
      <Fab
        className={classes.fabAdd}
        color='primary'
        onClick={() => setIsAddTodoVisible(true)}>
        <AddIcon />
      </Fab>
      <Fab
        className={classes.fabRefetch}
        color='secondary'
        onClick={async () => await refetch()}>
        <CachedIcon />
      </Fab>
      <TodoInputDialog
        isVisible={isAddTodoVisible}
        onCancel={() => setIsAddTodoVisible(false)}
        onDone={async (input) => {
          await add(input as Todo);
          await refetch();
          setIsAddTodoVisible(false);
        }}
      />
      <Grid item xs={12}>
        <List
          style={{width: '100vw'}}
          headerCells={['done', 'description', 'actions', 'name']}
          rows = { data || []}
          error={error}
          renderTableCell={(field: string, row: any) => {
            switch (field) {
              case 'actions':
                return (<Fragment>
                  <Button color="primary" onClick={async () => { await toggleDone(row); await refetch(); }}>Done</Button>
                  <Button color="secondary" onClick={async () => { await remove(row); await refetch(); }}>Remove</Button>
                </Fragment>)
              default:
                return <span>{(row as any)[field]}</span>
            }
          }}
        />
      </Grid>
    </Fragment>
  );
};

const styles = createStyles({
  fabAdd:
  {
    position: 'absolute',
    top: 50,
    right: 80,
  },
  fabRefetch:
  {
    position: 'absolute',
    top: 50,
    right: 40,
  },

});

export default withStyles(styles)(Home);
