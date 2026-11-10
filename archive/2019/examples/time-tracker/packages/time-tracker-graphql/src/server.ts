import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolvers';
import { S3, Lambda } from 'aws-sdk';

const s3 = new S3({ region: 'eu-central-1' });
const lambda = new Lambda({ region: 'eu-central-1' });

export default new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  context:
    {
      s3,
      lambda,
    },
});
