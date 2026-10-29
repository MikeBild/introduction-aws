import * as React from 'react';
import { StatelessComponent, useState } from 'react';
import {
  LinearProgress,
  Fab,
  Button,
  Grid,
  withStyles,
  WithStyles,
  createStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CachedIcon from '@material-ui/icons/Cached';
import { List, InputDialog } from '@introduction-aws/todo-webcomponents';
import { Consumer, Context } from '../lib/appContext';
import { Todo } from '../lib/api-todos';

interface TProps {
  context: Context;
}

export const Todos: StatelessComponent<TProps & WithStyles<typeof styles>> = ({
  classes,
  context,
}) => {
  const [isAddTodoVisible, setIsAddTodoVisible] = useState(false);

  const { data = [], isLoading = false, error, refetch } = context.useFetch();

  return (
    <Consumer>
      {context => {
        return (
          <>
            <div style={{ height: 4 }}>{isLoading && <LinearProgress />}</div>
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
            <InputDialog
              title='New Todo'
              explanation='Enter a description'
              isVisible={isAddTodoVisible}
              onCancel={() => setIsAddTodoVisible(false)}
              onDone={async input => {
                await context.apis.todos.add(input as Todo);
                await refetch();
                setIsAddTodoVisible(false);
              }}
            />
            <Grid item xs={12}>
              <List
                style={{ width: '100vw' }}
                headerCells={['done', 'description', 'actions']}
                rows={data || []}
                error={error}
                renderTableCell={(field: string, row: any) => {
                  switch (field) {
                    case 'actions':
                      return (
                        <>
                          <Button
                            color='primary'
                            onClick={async () => {
                              await context.apis.todos.toggleDone(row);
                              await refetch();
                            }}>
                            Done
                          </Button>
                          <Button
                            color='secondary'
                            onClick={async () => {
                              await context.apis.todos.remove(row);
                              await refetch();
                            }}>
                            Remove
                          </Button>
                        </>
                      );
                    default:
                      return <span>{(row as any)[field]}</span>;
                  }
                }}
              />
            </Grid>
          </>
        );
      }}
    </Consumer>
  );
};

const styles = createStyles({
  fabAdd: {
    position: 'absolute',
    top: 50,
    right: 90,
  },
  fabRefetch: {
    position: 'absolute',
    top: 50,
    right: 40,
  },
});

export default withStyles(styles)(Todos);
