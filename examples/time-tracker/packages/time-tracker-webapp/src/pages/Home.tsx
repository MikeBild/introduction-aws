import React, { StatelessComponent, Fragment, useState } from 'react';
import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import { TableHead } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {
  withStyles,
  Theme,
  createStyles,
  WithStyles,
} from '@material-ui/core/styles';

import RecordHoursMutation from './record-hours-mutation.gql';
import SummaryQuery from './summary-query.gql';

type SummaryItem = {
  id: string;
  hours: number;
  count: number;
};

type TProps = {} & WithStyles<typeof styles>;

const Home: StatelessComponent<TProps> = ({ classes }) => {
  const [
    isHoursInputDialogVisible,
    setIsHoursInputDialogVisible,
  ] = useState(false);

  const [
    nameInput,
    setNameInput,
  ] = useState('');

  const [
    hoursInput,
    setHoursInput,
  ] = useState('');

  return (
    <Query query={SummaryQuery} notifyOnNetworkStatusChange={true}>
      {({ data: { summary = [] }, loading, error }) => {
        return (
          <Fragment>
            {loading && <LinearProgress />}

            <Dialog open={Boolean(error)}>
              <div style={{ padding: 10 }}>
                <Typography variant='h6' color='inherit'>
                  {error && error.message}
                </Typography>
              </div>
            </Dialog>

            <Fab
              className={classes.fab}
              color='secondary'
              onClick={() => setIsHoursInputDialogVisible(true)}>
              <AddIcon />
            </Fab>

            <Dialog open={isHoursInputDialogVisible}>
              <DialogTitle>Enter your daily working hours</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Enter your name and your daily working hours.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin='dense'
                  label='Name'
                  type='name'
                  fullWidth
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
                <TextField
                  margin='dense'
                  label='Hours'
                  type='text'
                  fullWidth
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Mutation mutation={RecordHoursMutation}>
                  {(recordHours) => {
                    return (
                      <Button
                        onClick={async () => {
                          await recordHours({
                            variables:
                              {
                                input:
                                  {
                                    name: nameInput,
                                    hours: parseFloat(hoursInput),
                                  },
                              },
                            update(cache) {
                              const { count = 0, hours = 0, id }: any =
                                cache.readFragment({
                                  id: `Summary:${nameInput}`,
                                  fragment:
                                    gql`
                                      fragment summay on Summary {
                                        id
                                        count
                                        hours
                                      }
                                    `,
                                }) || {};
                              id
                                ? cache.writeData({
                                    id: `Summary:${nameInput}`,
                                    data:
                                      {
                                        id: nameInput,
                                        count: count + 1,
                                        hours: hours + parseFloat(hoursInput),
                                      },
                                  })
                                : cache.writeQuery({
                                    query: SummaryQuery,
                                    data:
                                      {
                                        summary:
                                          [
                                            ...summary,
                                            {
                                              id: nameInput,
                                              count: count + 1,
                                              hours:
                                                hours + parseFloat(hoursInput),
                                              __typename: 'Summary',
                                            },
                                          ],
                                      },
                                  });
                            },
                          });
                          setIsHoursInputDialogVisible(false);
                        }}
                        color='primary'>
                        Done
                      </Button>
                    );
                  }}
                </Mutation>
                <Button
                  onClick={() => setIsHoursInputDialogVisible(false)}
                  color='primary'>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.map(({ id, hours, count }: SummaryItem) => {
                  return (
                    <TableRow key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{hours}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Fragment>
        );
      }}
    </Query>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    fab:
      {
        position: 'absolute',
        top: theme.spacing.unit * 4,
        right: theme.spacing.unit * 2,
      },
  });

export default withStyles(styles)(Home);
