const { App } = require('@aws-cdk/cdk');
const EventOrganizerWebApp = require('./stack');

const app = new App();

new EventOrganizerWebApp(app, 'event-organizer-webapp', {
  domainName: 'mikebild.com',
  hostName: 'event-organizer',
  region: 'eu-central-1',
});

app.run();
