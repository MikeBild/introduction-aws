import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import { List } from '@introduction-aws/todo-webcomponents';
import README from '../../todo-webcomponents/README.md';

storiesOf('Organisms/List', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))
  .add('with mock rows', () => <List headerCells={object('headerCells', ['id', 'value'])} rows={object('rows', [{ id: 1, value: 'A' }])} />)
  .add('with isLoading', () => <List isLoading />)
  .add('with error', () => <List error={new Error(text('error', 'custom error...'))} />)