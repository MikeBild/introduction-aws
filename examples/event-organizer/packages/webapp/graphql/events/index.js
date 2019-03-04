const events = require('./events.json');

module.exports = {
  typeDefs: `
  type Query {
    events: [Event]
  }

  type Event {
    id: ID!
    title: String
    start: AWSDateTime
    end: AWSDateTime
    allDay: Boolean
  }
  `,
  resolvers: {
    Query: {
      events: () => {
        return events;
      },
    },
  },
};
