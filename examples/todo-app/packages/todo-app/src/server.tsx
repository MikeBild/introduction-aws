const IS_IN_LAMBDA = !!process.env.LAMBDA_TASK_ROOT;
const PORT = process.env.PORT || 8080;
const API_URL = process.env.API_URL || 'http://localhost:9090'

import React from 'react';
import express from 'express';
import cors from 'cors';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { JssProvider, SheetsRegistry } from 'react-jss';
import { createGenerateClassName } from '@material-ui/core/styles';
import { createServer, proxy } from 'aws-serverless-express';
import App from './App';

const sheets = new SheetsRegistry();
const generateClassName = createGenerateClassName();

const app = express();

app.use(cors());
app.use(express.static(`${__dirname}/public`));
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
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <link rel="shortcut icon" href="favicon.3abb3c31.ico">
          <style type="text/css">${sheets.toString()}</style>
          <script src="client.js" defer></script>
          <title>Todo</title>
        </head>
        <body>
          <div id="app">${markup}</div>
          <script>API_URL='${API_URL}'</script>
        </body>
      </html>
    `);
});

IS_IN_LAMBDA
  ? (module.exports.handler = (event: any, context: any) =>
    proxy(createServer(app), event, context))
  : app.listen(PORT, () => console.log(`Listening on ${PORT}`));
