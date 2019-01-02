const IS_IN_LAMBDA = !!process.env.LAMBDA_TASK_ROOT;
const PORT = process.env.PORT || 8080;

import React from 'react';
import express from 'express';
import cors from 'cors';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { JssProvider, SheetsRegistry } from 'react-jss';
import { createGenerateClassName } from '@material-ui/core/styles';
import { createServer, proxy } from 'aws-serverless-express';
import App from '../app/App';
const sheets = new SheetsRegistry();
const generateClassName = createGenerateClassName();

const app = express();

app.use(cors());
app.get(/\/.*index.*/, express.static(`${__dirname}/../browser`));

app.get('*', (req, res) => {
  const markup = renderToString(
    <JssProvider registry={sheets} generateClassName={generateClassName}>
      <StaticRouter location={req.url} context={{}}>
        <App />
      </StaticRouter>
    </JssProvider>
  );

  res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Todo</title>
          <script src="/index.js" defer></script>
          <style type="text/css">${sheets.toString()}</style>
        </head>
        <body>
          <div id="app">${markup}</div>
        </body>
      </html>
    `);
});

IS_IN_LAMBDA
  ? (module.exports.handler = (event: any, context: any) =>
      proxy(createServer(app), event, context))
  : app.listen(PORT, () => console.log(`Listening on ${PORT}`));
