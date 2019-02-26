import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import { SpinnerButton } from '@introduction-aws/todo-webcomponents';
import README from '../../todo-webcomponents/README.md';

storiesOf('Molecuels/SpinnerButton', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))
  .add('default', () => (
    <SpinnerButton
      value={text('value', 'Click Me!')}
      isLoading={boolean('isLoading', false)}
      style={{ width: 200, height: 50 }}
      onClick={() => alert('Clicked!')}
      color={text('color', 'primary')}
    />
  ));
