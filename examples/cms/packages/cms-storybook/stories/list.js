import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import apolloStorybookDecorator from 'apollo-storybook-react';
import { withReadme } from 'storybook-readme';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import typeDefs from '../graphql/schema.graphql';
import mocks from '../graphql/mocks';

import List from '@introduction-aws/list';
import ListREADME from '../../cms-webapp-components/list/README.md';

storiesOf('Atomics', module).add('Empty', () => <div />);
storiesOf('Molecules', module).add('Empty', () => <div />);
storiesOf('Organisms/List', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(ListREADME))
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
      apolloLinkOptions: { delayMs: 2000 },
    })
  )
  .add('with mocks', () => (
    <List
      style={{ width: '100%' }}
      headerCells={['id', 'value']}
      rows={object('rows', [
        { id: 1, value: 'Hello World' },
      ])}
      renderTableCell={(field, row) => <span>{row[field]}</span>}
    />
  ))
  .add('with error message', () => (
    <List
      style={{ width: '100%' }}
      headerCells={['id', 'value']}
      rows={[{ id: 1, value: 'Hello World' }]}
      renderTableCell={(field, row) => <span>{row[field]}</span>}
      error={new Error(text('error', 'Example error message!'))}
    />
  ))
  .add('with GraphQL', () => (
    <Query
      query={gql`
        query ItemList {
          items {
            id
            value
          }
        }
      `}>
      {({ data: { items = [] }, loading, error }) => (
        <List
          style={{ width: '100%' }}
          rows={items}
          headerCells={['id', 'value']}
          renderTableCell={(field, row) => <span>{row[field]}</span>}
          isLoading={loading}
          error={error}
        />
      )}
    </Query>
  ));
storiesOf('Templates', module).add('Empty', () => <div />);
storiesOf('Pages', module).add('Empty', () => <div />);