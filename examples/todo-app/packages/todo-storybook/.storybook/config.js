import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';

addDecorator(
  withOptions({
    name: 'Todo-App Web-Components',
    url: 'https://todo-webapp.mikebild.com',
  })
);

function loadStories() {
  require('../stories/list');
  require('../stories/form');
}

configure(loadStories, module);