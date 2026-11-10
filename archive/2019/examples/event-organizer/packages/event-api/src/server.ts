const IS_IN_LAMBDA = !!process.env.LAMBDA_TASK_ROOT;
const PORT = process.env.PORT;

import 'isomorphic-fetch';
import express from 'express';
import cors from 'cors';
import { createServer, proxy } from 'aws-serverless-express';
import listRoutes from 'express-list-endpoints';
import events from './routes/events';
import authMiddleware from './lib/auth-middleware';

const app = express();
app.disable('x-powered-by');

app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.get('/', (_, res) => res.send(listRoutes(app)));
app.use(authMiddleware());
app.use('/events', events);

app.use((error, req, res, next) => {
  res.status(500).send({ message: error.message });
  next();
});

if (IS_IN_LAMBDA) {
  module.exports.handler = (event: any, context: any) => {
    console.log({ event, context, env: process.env });
    proxy(createServer(app), event, context);
  };
} else {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}
