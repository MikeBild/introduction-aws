const IS_IN_LAMBDA = !!process.env.LAMBDA_TASK_ROOT;
const PORT = process.env.PORT || 8080;
import express from 'express';
import server from './server';
import { createServer, proxy } from 'aws-serverless-express';

const app = express();
app.get('/config', (req, res) => {
  res.send(process.env);
});

server.applyMiddleware({
  app,
  path: '/',
  cors: { origin: '*', credentials: true, allowedHeaders: '*', methods: '*' },
});

IS_IN_LAMBDA
  ? (module.exports.handler = (event, context) =>
      proxy(createServer(app), event, context))
  : app.listen(PORT, () => console.log(`Listening on ${PORT}`));
