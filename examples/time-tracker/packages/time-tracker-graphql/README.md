# Time-Tracker GraphQL API

* Apollo GraphQL Server
* AWS-SDK S3 Storage Access
* AWS Lambda Deployment
* AWS API-Gateway

## Development

```bash
yarn
yarn dev
```

## Production

```bash
yarn
yarn build
yarn start
```

## AWS-CDK Deploy

```bash
yarn deploy
```

## GraphQL API

### Queries

```graphql
query Summary {
  summary {
    id
    count
    hours
  }
}

query Me {
  me(name: "mike") {
    summary {
      id
      count
      hours
    }
  }
}
```

### Mutations

```graphql
mutation RequestForRelease {
  requestForRelease(input: { id: "mike" }) {
    success {
      id
      taskToken
      executionArn
      startDate
    }
    failure {
      message
    }
  }
}

mutation RecordHours {
  recordHours(input: { name: "heike", hours: 10 }) {
    success {
      id
      name
      hours
      date
    }
    failure {
      message
    }
  }
}
```