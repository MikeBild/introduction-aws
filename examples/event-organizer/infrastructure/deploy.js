const { App } = require('@aws-cdk/cdk');

const EventOrganizerWebApp = require('../packages/webapp/infrastructure/stack');

const domainName = 'mikebild.com';

const app = new App();

new EventOrganizerWebApp(app, 'event-organizer-webapp', {
  domainName,
  hostName: 'event-organizer',
  region: 'eu-central-1',
});

app.run();
