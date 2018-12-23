import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolvers';
import { S3 } from 'aws-sdk';
const s3 = new S3({});

export default new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  context:
    {
      s3,
    },
});
