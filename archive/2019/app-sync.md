# AppSync

* **Serverless** Data-Integration Layer
* Typed-API via GraphQL
* Supports multiple **GraphQL-APIs**
* **Logging** and Tracing via CloudWatch
* Supports different **Authentication** types
* Supports different **DataSources**
  * Lambda
  * HTTP
  * DynamoDB
* Bind Queries, Mutation, Subscription **Resolvers** to Schema
* Supports different **Client-Platforms** (iOS, Android, React, React-Native, Angular)
* Some of the SDKs supports Offline-Data-Handling and Optimistic-UI-Updates

## GraphQL-API Server

See [GraphQL-API via Infrastructure as Code with AWS-CDK](cdk/appsync.md)

## GraphQL-API Client

### AppSync Client

* [JavaScript AppSync Client](https://github.com/awslabs/aws-mobile-appsync-sdk-js)

### React

### Setup

1. `yarn add aws-appsync react react-dom react-apollo`
2. `yarn add parcel`
3. `touch index.html`
4. `touch index.jsx`

**`index.html`**

```html
```

#### React-Apollo

**`index.jsx`**

```jsx
import React from 'react'
import { render } from 'react-dom'
import Client from 'aws-appsync'
import { ApolloProvider } from 'react-apollo'
import App from './App'

const client = new Client({
  url: global.graphqlEndpoint,
  region: global.region,
  auth: {
    type: global.authenticationType,
    apiKey: global.apiKey,
  }
})

render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('app'))
```

## Resources

* [Awesome AppSync](https://github.com/dabit3/awesome-aws-appsync)