const IS_IN_LAMBDA = !!process.env.LAMBDA_TASK_ROOT;
const PORT = process.env.PORT || 8080;
const GRAPHQL_URL = process.env.GRAPHQL_URL || '...';
const GRAPHQL_APIKEY = process.env.GRAPHQL_APIKEY || '...';

import express from 'express';
import { createServer, proxy } from 'aws-serverless-express';

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/../client`));

app.use('*', (_, res) =>
  res.render('index', { title: 'CMS', GRAPHQL_URL, GRAPHQL_APIKEY })
);

IS_IN_LAMBDA
  ? (module.exports.handler = (event: any, context: any) =>
      proxy(createServer(app), event, context))
  : app.listen(PORT, () => console.log(`Listening on ${PORT}`));
