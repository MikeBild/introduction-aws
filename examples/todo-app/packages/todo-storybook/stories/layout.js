import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import { Layout } from '@introduction-aws/todo-webcomponents';
import README from '../../todo-webcomponents/README.md';

storiesOf('Templates/Layout', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))
  .add('default', () => (
    <Layout
      name={text('name', 'Example-App')}
      version={text('version', '1.0.0')}
      renderLinks={() => <div />}
      renderUser={() => <div />}>
      <h1>Example Layout</h1>
    </Layout>
  ));
