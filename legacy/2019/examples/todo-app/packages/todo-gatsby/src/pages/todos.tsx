import * as React from 'react';
import { graphql } from 'gatsby';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Layout from '../components/layout';

interface TodosAllQueryProps {
  error?: Error;
  loading: boolean;
  data: {
    todos?: [];
  };
  refetch: () => void;
}

interface TodoPageProps {
  data: {
    site: {
      buildTime: string;
    };
  };
}

const TodosAllQuery = gql`
  query TodosAll {
    todos {
      id
      description
      done
      username
      modifiedAt
      createdAt
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

export default ({
  data: {
    site: { buildTime },
  },
}: TodoPageProps) => {
  return (
    <Layout>
      <h1>Todos ({buildTime}) </h1>
      <Query query={TodosAllQuery} notifyOnNetworkStatusChange>
        {({
          data: { todos } = {},
          error,
          loading,
          refetch,
        }: TodosAllQueryProps) => {
          return (
            <>
              <button onClick={() => refetch()} disabled={loading}>
                Refresh
              </button>
              {error && <div>{error.message}</div>}
              {todos &&
                todos.map(({ id, description, modifiedAt }) => (
                  <div key={id}>
                    {description}, {modifiedAt}
                  </div>
                ))}
            </>
          );
        }}
      </Query>
    </Layout>
  );
};
