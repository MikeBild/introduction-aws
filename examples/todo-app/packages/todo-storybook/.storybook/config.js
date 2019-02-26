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
  require('../stories/input-dialog');
  require('../stories/layout');
  require('../stories/spinner-button');
}

configure(loadStories, module);
