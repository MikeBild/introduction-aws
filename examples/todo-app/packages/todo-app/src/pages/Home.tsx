import React, { Fragment, StatelessComponent, useState } from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import useFetch from '../lib/useFetch';
import TodoInputDialog from '../organisms/TodoInputDialog';
import { List } from '@introduction-aws/todo-webcomponents';

declare let global: {
  API_URL: string;
};

type TProps = {} & WithStyles<typeof styles>;

export const Home: StatelessComponent<TProps> = ({ classes }) => {
  const [
    isAddTodoVisible,
    setIsAddTodoVisible,
  ] = useState(false);

  const { data = [], loading = false, error } = useFetch({
    url: `${global.API_URL || ''}/todos`,
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
          await fetch(
            `${global.API_URL}/todos`,
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
      <List
        headerCells={['name', 'description', 'done', 'actions']}
        rows={data || []}
        isLoading={loading}
        error={error}
        renderTableCell={(field: string, row: any) => {
          switch (field) {
            case 'actions':
              return <button onClick={async () => {
                await fetch(
                  `${global.API_URL}/todos/done`,
                  {
                    method: 'PUT',
                    body: JSON.stringify({ id: row.id }),
                    headers:
                    {
                      'Content-Type': 'application/json',
                    },
                  }
                );
              }}>Done</button>
            default:
              return <span>{(row as any)[field]}</span>
          }
        }}
      />
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
