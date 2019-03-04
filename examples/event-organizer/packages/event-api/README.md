# Event-API

- [TypeScript](https://www.typescriptlang.org/)

## Live

- [Event-API](https://xrtbumqy1m.execute-api.eu-central-1.amazonaws.com/prod/)

## API

```bash
curl -XPOST http://localhost:9090/events -H Content-Type:application/json -d '{"title": "Example Event 1", "start": "2019-03-01T22:00:00.000Z", "end": "2019-03-02T22:00:00.000Z", "allDay": true}'
```

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

- Lambda Deployment

```bash
yarn deploy
```
