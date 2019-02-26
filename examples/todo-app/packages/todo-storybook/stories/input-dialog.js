import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import { InputDialog, Input } from '@introduction-aws/todo-webcomponents';
import README from '../../todo-webcomponents/README.md';

storiesOf('Organisms/InputDialog', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))
  .add('is visible', () => (
    <InputDialog
      title={text('title', 'Example Title')}
      explanation={text('explanation', 'Example Explanation')}
      isVisible={boolean('isVisible', true)}
      onCancel={() => {
        alert('Cancel');
      }}
      onDone={(input: Input) => {
        alert(JSON.stringify(input, null, 2));
      }}
      isLoading={boolean('isLoading', false)}
      errorMessage={text('errorMessage', '')}
    />
  ));
