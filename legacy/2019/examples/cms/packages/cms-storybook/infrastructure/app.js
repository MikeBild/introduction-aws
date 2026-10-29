const { App } = require('@aws-cdk/cdk');
const CMSStorybookWebite = require('./stack');

const app = new App();

new CMSStorybookWebite(app, 'cms-storybook', {
  domainName : 'mikebild.com',
  hostName   : 'cms-storybook',
});

app.run();
