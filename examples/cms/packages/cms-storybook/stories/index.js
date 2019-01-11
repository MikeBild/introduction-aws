import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object } from '@storybook/addon-knobs';
import apolloStorybookDecorator from 'apollo-storybook-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import typeDefs from '../graphql/schema.graphql';
import mocks from '../graphql/mocks';

import List from 'cms-webapp-component-list';

storiesOf('CMS Components', module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    })
  )
  .addDecorator(withKnobs)
  .add('Table', () => (
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
          rows={object('rows', items)}
          renderHeadRow={() => (
            <tr>
              <th>ID</th>
              <th>Value</th>
            </tr>
          )}
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
