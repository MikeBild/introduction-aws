# Time-Tracker App

* [ReactJS](https://reactjs.org/)
* [Apollo-GraphQL](https://www.apollographql.com/docs/react/)
* [Material-UI](https://material-ui.com/)
* [ParcelJS](https://parceljs.org)
* [TypeScript](https://www.typescriptlang.org/)

## Live

* [React Web-App](https://s3.eu-central-1.amazonaws.com/time-tracker-webapp.mikebild.com/index.html)

## Components

### Home

* Executes `Summary`-Query via [GraphQL-API](../time-tracker-graphql/README.md#queries)

![Home](docs/home.png)

### Hours Input

* Add working hours for a name
* Executes `RecordHours`-Mutation via [GraphQL-API](../time-tracker-graphql/README.md#mutations)
* Implements `Optimistic-UI` to handle long running  (> 3s) [summary report](../time-tracker-reports-generator/README.md) generation

![Hours](docs/hours.png)

## Development

```bash
yarn
yarn dev
yarn build
yarn start
```

## Production

```bash
yarn
yarn build
yarn start
```

## AWS-CDK Deploy

* S3 WebSite Deployment

```bash
yarn deploy
```