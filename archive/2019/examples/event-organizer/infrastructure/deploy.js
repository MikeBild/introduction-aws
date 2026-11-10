const { App } = require('@aws-cdk/cdk');

const EventOrganizerWebApi = require('../packages/events-api/infrastructure/stack');
const EventOrganizerWebApp = require('../packages/webapp/infrastructure/stack');

const domainName = 'mikebild.com';

const app = new App();

new EventOrganizerWebApi(app, 'event-api', {
  userPoolId: process.env.USER_POOL_ID,
  userPoolClientId: process.env.USER_POOL_CLIENT_ID,
});

new EventOrganizerWebApp(app, 'event-organizer-webapp', {
  domainName,
  hostName: 'event-organizer',
  region: 'eu-central-1',
});

app.run();
