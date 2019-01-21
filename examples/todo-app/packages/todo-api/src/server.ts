const IS_IN_LAMBDA = !!process.env.LAMBDA_TASK_ROOT;
const PORT = process.env.PORT || 9090;

import express from 'express';
import cors from 'cors';
import { createServer, proxy } from 'aws-serverless-express';
import listRoutes from 'express-list-endpoints';
import todos from './routes/todos';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/todos', todos);
app.get('/', (_, res) => res.send(listRoutes(app)));

if (IS_IN_LAMBDA) {
  module.exports.handler = (event: any, context: any) => {
    console.log({ event, context });
    proxy(createServer(app), event, context);
  };
} else {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}
