# CMS GraphQL-API

* AWS S3
* AWS IAM
* AWS Lambda
* AWS AppSync

## Production

```bash
yarn
yarn build
```

## AWS-CDK Deploy

```bash
yarn deploy
```

## GraphQL API

### Queries

```graphql
query ArticleList {
  articles {
    id
    versionId
    isLatest
    modifiedAt
    article {
      id
      name
      content
    }
  }
}

query ArticleGet($id: ID!) {
  article(
    id: $id
  ) {
    id
    name
    content
  }
}

query UserProfileList {
  userProfiles {
    id
    name
    fullName
  }
}
```

### Mutations

```graphql
mutation ArticleAdd($input: ArticleAddInput!) {
  articleAdd(input: $input) {
    result {
      id
      name
      content
    }
    failure {
      message
    }
  }
}

mutation ArticleUpdate($input: ArticleUpdateInput!) {
  articleUpdate(input: $input) {
    result {
      id
      name
      content
    }
    failure {
      message
    }
  }
}

mutation ArticlePreview($input: ArticlePreviewInput!) {
  articlePreview(input: $input) {
    result {
      url
      html
    }
    failure {
      message
    }
  }
}
```