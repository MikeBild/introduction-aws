import * as React from 'react';
import { Fragment } from 'react'
import { Query } from 'react-apollo';
import ArticleListQuery from './articleListQuery.gql';
import ArticleFragement from './articleFragment.gql';
import List from '@introduction-aws/list';
import { Typography } from '@material-ui/core';

export default () => (
  <Fragment>
    <Typography variant="h4" gutterBottom>Articles</Typography>
    <Query query={ArticleListQuery}>
      {({ data: { articles = [] }, loading, error }) => {
        return (
          <List
            style={{ width: '100%' }}
            rows={articles.map(item => item.article)}
            headerCells={['content']}
            isLoading={loading}
            error={error}
            renderTableCell={(field, row) => <span>{row[field]}</span>}
          />
        )
      }}
    </Query>
  </Fragment>
);
