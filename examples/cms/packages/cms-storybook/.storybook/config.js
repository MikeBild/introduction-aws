import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';

addDecorator(
  withOptions({
    name : 'CMS-App Components',
    url  : 'https://cms-webapp.mikebild.com',
  })
);

function loadStories() {
  require('../stories/index.js');
}

configure(loadStories, module);
