import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

const SUMMARY_QUERY = gql`
  query Summary {
    summary {
      id
      count
      hours
    }
  }
`;
export default () => {
  return (
    <Query query={SUMMARY_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading ...</div>;
        if (error) return <div>{error.message}</div>;

        return <pre>{JSON.stringify(data, null, 2)}</pre>;
      }}
    </Query>
  );
};
