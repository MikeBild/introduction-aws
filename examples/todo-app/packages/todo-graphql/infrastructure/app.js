const { App } = require('@aws-cdk/cdk');
const GraphQLApi = require('./stack');

const app = new App();

new GraphQLApi(app, 'todo-graphql', {
  userPoolId: 'eu-central-1_tld7sRP50',
  awsRegion: 'eu-central-1',
  todoApiEndpoint: 'https://krdi0w2e8i.execute-api.eu-central-1.amazonaws.com',
});

app.run();
