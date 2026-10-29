import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import Layout from '@introduction-aws/layout';
import LayoutREADME from '../../cms-webapp-components/layout/README.md';

console.log({Layout})

storiesOf('Templates/Layout', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(LayoutREADME))
  .add('with children', () => (
    <Layout name={'Layout Demo'} version={'1.0.0'}>
      <h1>Demo Layout</h1>
    </Layout>
  ))