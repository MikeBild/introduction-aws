# Todo-API

- [TypeScript](https://www.typescriptlang.org/)

## Live

- [Todo-API](https://xrtbumqy1m.execute-api.eu-central-1.amazonaws.com/prod/)

## API

```bash
curl -XPOST http://localhost:8080/todos -H Content-Type:application/json -d '{"description":"todo 1", "name": "mike", "done": true }'
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
