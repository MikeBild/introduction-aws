import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';

addDecorator(
  withOptions({
    name: 'CMS-App Components',
    url: 'https://cms-webapp.mikebild.com',
  })
);

function loadStories() {
  require('../stories/list');
  require('../stories/layout');
  require('../stories/form-dialog');
}

configure(loadStories, module);
