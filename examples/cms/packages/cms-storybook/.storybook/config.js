import { configure, addDecorator } from '@storybook/react';
import apolloStorybookDecorator from 'apollo-storybook-react';
import typeDefs from '../graphql/schema.graphql';
import mocks from '../graphql/mocks';

addDecorator(
  apolloStorybookDecorator({
    typeDefs,
    mocks,
  })
);

function loadStories() {
  require('../stories/index.js');
}

configure(loadStories, module);
