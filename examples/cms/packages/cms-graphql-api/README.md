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
query AllArticles {
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

query GetArticle($id: ID!) {
  article(
    id: $id
  ) {
    id
    name
    content
  }
}
```

### Mutations

```graphql
mutation AddArticle($input: ArticleAddInput!) {
  addArticle(input: $input) {
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

mutation UpdateArticle($input: ArticleUpdateInput!) {
  updateArticle(input: $input) {
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
```