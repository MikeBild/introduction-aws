import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import { Form } from '@introduction-aws/todo-webcomponents';
import README from '../../todo-webcomponents/README.md';

storiesOf('Organisms/Form', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))
  .add('with ...', () => <Form />)