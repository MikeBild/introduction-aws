[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

# Time-Tracker App Example

## Architecture

![Architecture](./architecture.png)

* Serverless
* API-Gateway
* Messaging
* CQRS
* Event-Sourcing

## Live

* [React Web-App](https://s3.eu-central-1.amazonaws.com/time-tracker-webapp.mikebild.com/index.html)
* [GraphQL API](https://eriuqjklw1.execute-api.eu-central-1.amazonaws.com/prod)

## Technologies

* **JavaScript/TypeScript**
* **NodeJS**
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

## Components

### `time-tracker-webapp`

> Single-Page-Application User-Interface.

* React SPA-Web-App
* GraphQL Data Bindings (Apollo-Client)
* Optimistic UI
* AWS-S3 WebSite Deployment

### `time-tracker-graphql`

> Uniform GraphQL based API for application queries and mutations.

* GraphQL-API Gateway (Apollo-Server)
* Handle request/responses using [`aws-serverless-express`](https://github.com/awslabs/aws-serverless-express)
* Forward HTTP Request/Responses via API-Gateway
* S3-Storage access
* Lambda-Function invocations
* Deployment as Lambda-Function

### `time-tracker-reports-generator`

> Constant generation (via S3-Notification) of hours summary reports after entering hourly entries.

* Deployment as Lambda-Function
* S3-Storage Notification as Lambda-Trigger

### `time-tracker-request-confirmation`

> Orchestrate Lambda-Functions to start, aprrove or reject a user-based monthly Hour-Report request.

* Workflow/Process-Manager via Step-Function
* Lambda-Function to start the approval workflow
* Lambda-Function to confirm/reject the approval workflow
* Deployment of Lambda-Functions and a Step-Function

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