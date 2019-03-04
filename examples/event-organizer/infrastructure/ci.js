const { App } = require('@aws-cdk/cdk');
const EventOrganizerCiPipeline = require('./ci-pipeline');

const app = new App();

new EventOrganizerCiPipeline(app, 'event-organizer-app-ci-pipeline');

app.run();
