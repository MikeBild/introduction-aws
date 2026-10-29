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
      async events() {
        return list();
      },
    },
  },
};

async function list() {
  const response = await fetch(`${process.env.GATSBY_EVENT_API_URL}events`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.GATSBY_AUTH_JWT_TOKEN,
    },
  });

  const payload = (await response.json()) || {};

  if (response.status >= 400)
    throw new Error(payload.message || response.statusText);

  return payload;
}
