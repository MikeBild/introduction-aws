import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import FormDialog from '@introduction-aws/form-dialog';
import FormDialogREADME from '../../cms-webapp-components/form-dialog/README.md';

storiesOf('Organisms/Form-Dialog', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(FormDialogREADME))
  .add('with ...', () => (
    <FormDialog>
      <h1>Demo</h1>
    </FormDialog>
  ))