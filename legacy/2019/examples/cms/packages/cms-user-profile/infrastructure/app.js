const { App } = require('@aws-cdk/cdk');
const CMSUserProfile = require('./stack');

const app = new App();
new CMSUserProfile(app, 'cms-user-profile');
app.run();
