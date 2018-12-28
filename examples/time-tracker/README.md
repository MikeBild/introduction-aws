[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

# AWS Serverless Time-Tracker App Example

## Architecture

![Architecture](./architecture.png)

## Live

* [React Web-App](https://s3.eu-central-1.amazonaws.com/time-tracker-webapp.mikebild.com/index.html)
* [GraphQL API](https://ilk18d9m69.execute-api.eu-central-1.amazonaws.com/prod/)

## Technologies

* **NodeJS**
* **JavaScript/TypeScript**
* **React**
* **Apollo-GraphQL**
* Monorepo-Project with **Lerna**
* Programmatically Serverless-Deployment with **AWS-CDK**
* **AWS-SDK** Cloud-Service usage:
  * Storage and WebApp-Hosting using **S3**
  * Access via **API-Gateway**
  * Data-Processing and Web-Services using **Lambda-Function**
  * Workflow/Process-Manager via **Step-Function**
  * EMail via **SES**

## Setup your AWS-Account

> TBD!

## Development

```bash
yarn
yarn dev
```

## Deployment

```bash
yarn bootstrap & yarn deploy
```

## Release

```bash
npm lerna version
```