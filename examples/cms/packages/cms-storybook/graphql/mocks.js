import faker from 'faker';
import { MockList } from 'graphql-tools';

export default {
  Query : () => ({
    items : (source, args, context) =>
      new MockList(10, () => ({
        id    : faker.random.uuid(),
        value : faker.hacker.phrase(),
      })),
  }),
};
