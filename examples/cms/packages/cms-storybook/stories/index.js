import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object } from '@storybook/addon-knobs';
import apolloStorybookDecorator from 'apollo-storybook-react';
import { withReadme, withDocs } from 'storybook-readme';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import typeDefs from '../graphql/schema.graphql';
import mocks from '../graphql/mocks';

import List from 'cms-webapp-component-list';
import ListREADME from '../../cms-webapp-components/list/README.md';
console.log(ListREADME);
storiesOf('Atomics', module).add('Empty', () => <div />);
storiesOf('Molecules', module).add('Empty', () => <div />);
storiesOf('Organisms', module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(ListREADME))
  .addDecorator(withReadme(ListREADME))
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
    })
  )
  .add('Table with Mock-Data', () => (
    <List
      rows={[
        { id: 1, value: 'Hello World' },
      ]}
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
  ))
  .add('Table with GraphQL-Data', () => (
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
storiesOf('Templates', module).add('Empty', () => <div />);
storiesOf('Pages', module).add('Empty', () => <div />);
