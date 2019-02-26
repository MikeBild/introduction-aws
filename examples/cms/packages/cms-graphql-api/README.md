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
query AuthorList {
  authors {
    id
    fullName
    email
  }
}

query ArticleGet {
  article(id: "e59b8460-1567-11e9-b706-392e0ec275e9", versionId: "YfApSL2K3ZY0etH1xa8YG2G_xVvk2RWN") {
    ...FullArticle
  }
}

query ArticleList {
  articles(filter: { isLatest:false }) {
    id
    versionId
    modifiedAt
    isLatest
    article {
      ...FullArticle
    }
  }
}

fragment FullArticle on Article {
  id
  content
  versionId
  preview {
    id
    versionId
    content
    url
    html
    author {
      id
      fullName
      email
    }
  }
  author {
    id
    fullName
    email
  }
}
```

### Mutations

```graphql
mutation ArticleAdd($input: ArticleAddInput!)
  articleAdd(input: $input) {
    result {
     ...FullArticle
    }
    failure {
      message
    }
  }
}

mutation ArticleUpdate($input: ArticleUpdateInput!) {
  articleUpdate(input: $input) {
    result {
     ...FullArticle
    }
    failure {
      message
    }
  }
}

mutation ArticlePreview($input: ArticlePreviewInput!) {
  articlePreview(input: $input) {
    result {
      id
      versionId
      content
      url
      html
      author {
        id
        email
        fullName
      }
    }
    failure {
      message
    }
  }
}
```