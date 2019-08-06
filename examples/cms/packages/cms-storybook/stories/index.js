import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import apolloStorybookDecorator from 'apollo-storybook-react';
import { withReadme, withDocs } from 'storybook-readme';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import typeDefs from '../graphql/schema.graphql';
import mocks from '../graphql/mocks';

import List from 'cms-webapp-component-list';
import ListREADME from '../../cms-webapp-components/list/README.md';

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
      apolloLinkOptions : { delayMs: 2000 },
    })
  )
  .add('Table with Mock-Data', () => (
    <List
      style={{ width: '100%' }}
      rows={object('rows', [
        { id: 1, value: 'Hello World' },
      ])}
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
  .add('Table with Error-Mock-Data', () => (
    <List
      style={{ width: '100%' }}
      renderHeadRow={() => (
        <tr>
          <th>ID</th>
          <th>Value</th>
        </tr>
      )}
      error={new Error(text('error', 'Example error message!'))}
      renderError={(error) => (
        <tr>
          <td colSpan={2}>{error.message}</td>
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
      {({ data: { items = [] }, loading }) => (
        <List
          style={{ width: '100%' }}
          rows={items}
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
          isLoading={loading}
          renderLoading={() => (
            <tr>
              <td colSpan={2}>loading ...</td>
            </tr>
          )}
          renderError={(error) => (
            <tr>
              <td colSpan={2}>{error.message}</td>
            </tr>
          )}
        />
      )}
    </Query>
  ));
storiesOf('Templates', module).add('Empty', () => <div />);
storiesOf('Pages', module).add('Empty', () => <div />);
