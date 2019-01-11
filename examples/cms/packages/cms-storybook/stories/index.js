import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import List from 'cms-webapp-component-list';

const itemsListQuery = gql`
  query ItemList {
    items {
      id
      value
    }
  }
`;

storiesOf('CMS Components', module).addDecorator(withKnobs).add('Table', () => (
  <Query query={itemsListQuery}>
    {({ data: { items = [] } }) => (
      <List
        rows={items}
        renderRow={({ id, value }) => (
          <tr key={id}>
            <td>{id}</td>
            <td>{value}</td>
          </tr>
        )}
      />
    )}
  </Query>
));
