module.exports = {
  uri:
    'https://j7eex5otcbd4npqpr5w3zfglhy.appsync-api.eu-central-1.amazonaws.com/graphql',
  headers: {
    authorization:
      'eyJraWQiOiJnOGdUWjlGOWJpMmM1dGJKQ21oSnV4REd6OCttaHlOcUU2MjdpcVRwVWdzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlZGMyMzE0Ny0xY2QzLTQ0ZDAtOTcxYy1hYmFjOTAwYjBlYWMiLCJhdWQiOiIxMmU2MHQ1amw1M3Ria21zNmIxZ2thbzduYSIsImNvZ25pdG86Z3JvdXBzIjpbIlVzZXJzIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6ImU4MjM5MDU4LTM5ZDYtMTFlOS05NDQyLTE5NGFhN2ZiMTllZiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUxMTkzMDc5LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV90bGQ3c1JQNTAiLCJjb2duaXRvOnVzZXJuYW1lIjoiaW5mb0BtaWtlYmlsZC5jb20iLCJleHAiOjE1NTExOTY2NzksImlhdCI6MTU1MTE5MzA3OSwiZW1haWwiOiJpbmZvQG1pa2ViaWxkLmNvbSJ9.gzMsFFkL9Y3Rl3-tXyhuLRJaHYRJ-aoskxAi6HpcGgIJLHHjjm3a1Kd6mqsRy8plZ_W2MChPcmogqx8GIZfQTg0WdGOySJ4qHdvYuuSwllbB77ufdun27ApIbSNYZpgMnw6z8PkizfctA3ZG1OMmlWHj3SsTA1f8KnSCQqbpT4ZD_jiNzOSZyxPIILinFQn27t7NC9ZBagJa2ur7DnBxxbLZX89BgqovAaLsiTFR9RcKRZoPsU6qMMbs5Ehy_1ZQRIKOKs80A0HXeCUuQLNyXcV_v1loUrbAUccntT_LpoeldkWv9uTIEsLhH9C5jXefiSRIj2UGkGsa2uS1I8pUQg',
  },
  typeDefs: `
  schema {
    query: Query
  }

  type Query {
    todos(filter: TodosFilter): [Todo] @aws_auth(cognito_groups : ["Users"])
  }

  type Todo {
    createdAt: AWSDateTime
    description: String
    done: Boolean
    id: ID!
    modifiedAt: AWSDateTime
    username: ID
  }

  input TodosFilter {
    description: String
    done: Boolean
  }
  `,
};
