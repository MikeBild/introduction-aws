import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import { List } from '@introduction-aws/todo-webcomponents';
import README from '../../todo-webcomponents/README.md';

storiesOf('Organisms/List', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))
  .add('with mock rows', () => (
    <List
      headerCells={object('headerCells', ['id', 'value'])}
      rows={object('rows', [{ id: 'id-xyz', value: 'value-xyz' }])}
    />
  ))
  .add('with isLoading', () => <List isLoading />)
  .add('with error', () => (
    <List error={new Error(text('error', 'custom error...'))} />
  ))
  .add('with render table cell', () => (
    <List
      headerCells={object('headerCells', ['id', 'value', 'actions'])}
      rows={object('rows', [{ id: 'id-xyz', value: 'value-xyz' }])}
      renderTableCell={(field, row) => {
        switch (field) {
          case 'actions':
            return <button onClick={() => alert(row.id)}>Done</button>;
          default:
            return <span>{row[field]}</span>;
        }
      }}
    />
  ));
