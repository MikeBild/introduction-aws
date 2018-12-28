import React, { StatelessComponent, Fragment } from 'react';
import { Query } from 'react-apollo';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import { TableHead } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import SummaryQuery from './summary.gql';

type SummaryItem = {
  id: string;
  hours: number;
  count: number;
};
type TProps = {};

const Home: StatelessComponent<TProps> = () => {
  return (
    <Query query={SummaryQuery}>
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

export default Home;
