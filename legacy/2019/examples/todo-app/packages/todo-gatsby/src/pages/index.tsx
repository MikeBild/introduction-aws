import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

interface IndexPageProps {
  data: {
    todos: [];
  };
}

export default ({ data: { todos } }: IndexPageProps) => {
  return (
    <Layout>
      <h1>Todo-App</h1>
      <div>
        {todos &&
          todos.map(({ id, description, modifiedAt }) => (
            <div key={id}>
              {description}, {modifiedAt}
            </div>
          ))}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query IndexPage {
    todos {
      id
      description
      modifiedAt
    }
  }
`;
