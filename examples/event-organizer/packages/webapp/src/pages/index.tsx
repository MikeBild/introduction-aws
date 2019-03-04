import * as React from 'react';
import { graphql } from 'gatsby';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Grid, Toolbar, Typography } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

import Layout from '../components/layout';

interface EventsAllQueryProps {
  error?: Error;
  loading: boolean;
  data: {
    events?: [];
  };
  refetch: () => void;
}

interface EventsPageProps {
  data: {
    site: {
      buildTime: string;
    };
  };
}

const EventsAllQuery = gql`
  query EventsAll {
    events {
      id
      title
      start
      end
      allDay
    }
  }
`;

export const query = graphql`
  query SiteInfo {
    site {
      buildTime
    }
  }
`;

const IndexPage = ({
  classes,
}: EventsPageProps & WithStyles<typeof styles>) => {
  return (
    <Layout>
      <Query query={EventsAllQuery}>
        {({
          data: { events } = {},
          error,
          loading,
          refetch,
        }: EventsAllQueryProps) => {
          return (
            <div className={classes.root}>
              <Grid container justify='center'>
                <Grid item className={classes.calendar}>
                  <Toolbar disableGutters>
                    <Typography
                      variant='h6'
                      color='inherit'
                      noWrap
                      className={classes.errorMessage}>
                      {error && error.message}
                    </Typography>

                    <Button
                      onClick={() => refetch()}
                      variant='outlined'
                      className={classes.button}>
                      New
                    </Button>
                    <Button
                      onClick={() => refetch()}
                      disabled={loading}
                      variant='outlined'
                      className={classes.button}>
                      Refresh
                    </Button>
                  </Toolbar>
                  <BigCalendar
                    localizer={BigCalendar.momentLocalizer(moment)}
                    culture='de'
                    events={events || []}
                    startAccessor='start'
                    endAccessor='end'
                  />
                </Grid>
              </Grid>
            </div>
          );
        }}
      </Query>
    </Layout>
  );
};

const styles = () => ({
  root: {
    padding: 24,
  },
  calendar: {
    height: 800,
    width: 800,
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: '1.5rem',
  },
  button: {
    marginLeft: 10,
  },
  errorMessage: {
    flexGrow: 1,
  },
});

export default withStyles(styles)(IndexPage);
