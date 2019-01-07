const IS_IN_LAMBDA = !!process.env.LAMBDA_TASK_ROOT;
const PORT = process.env.PORT || 8080;
const GQL_URL = process.env.GRAPHQL_URL;
const GQL_APIKEY = process.env.GRAPHQL_APIKEY;

import express from 'express';
import { createServer, proxy } from 'aws-serverless-express';

const app = express();

app.use(express.static(`${__dirname}/public`));
app.get('/info', (_, res) => {
  res.send({ GQL_URL, GQL_APIKEY: '...' });
});

IS_IN_LAMBDA
  ? (module.exports.handler = (event: any, context: any) =>
      proxy(createServer(app), event, context))
  : app.listen(PORT, () => console.log(`Listening on ${PORT}`));
