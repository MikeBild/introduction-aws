const { App } = require('@aws-cdk/cdk');
const GraphQLApi = require('./stack');

const app = new App();

new GraphQLApi(app, 'todo-graphql', {
  userPoolId: 'eu-central-1_EXAMPLE00',
  awsRegion: 'eu-central-1',
  todoApiEndpoint: 'https://abcdef1234.execute-api.eu-central-1.amazonaws.com',
});

app.run();
