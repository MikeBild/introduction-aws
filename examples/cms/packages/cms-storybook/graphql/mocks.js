import faker from 'faker';
import { MockList } from 'graphql-tools';

export default {
  Query : () => ({
    items : (source, args, context) =>
      new MockList(5, () => ({
        id    : faker.random.uuid(),
        value : faker.hacker.phrase(),
      })),
  }),
};
