import { configure, addDecorator } from '@storybook/react';
import apolloStorybookDecorator from 'apollo-storybook-react';

addDecorator(
  apolloStorybookDecorator({
    typeDefs : `
    type Item {
      id: ID!
      value: String
    }

    type Query {
      items: [Item]
    }
    `,
    mocks    : {},
  })
);

function loadStories() {
  require('../stories/index.js');
}

configure(loadStories, module);
