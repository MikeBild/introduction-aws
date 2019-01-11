import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import List from 'cms-webapp-component-list';

storiesOf('CMS Components', module).addDecorator(withKnobs).add('Table', () => (
  <Query
    query={gql`
      query ItemList {
        items {
          id
          value
        }
      }
    `}>
    {({ data: { items = [] } }) => (
      <List
        rows={items}
        renderRow={({ id, value }) => (
          <tr key={id}>
            <td>ID: {id}</td>
            <td>Value: {value}</td>
          </tr>
        )}
      />
    )}
  </Query>
));
