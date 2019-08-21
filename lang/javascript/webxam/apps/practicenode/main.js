/**
 * @fileoverview Node練習用Webアプリケーション
 */

/* eslint-env node */

const express = require('express');
const MyEventLoop = require('./eventloop');

const app = express();
const port = 4000;

const contextRoot = '/webxam/apps/practicenode/';

app.get(contextRoot, (request, response) => {
  response.send('Practice Node');
});

app.get(`${contextRoot}hello`, (request, response) => {
  console.log(`Query: ${request.query}`);
  response.send('Hello Node World');
});

app.get(`${contextRoot}eventloop/redos`, (request, response) => {
  const el = new MyEventLoop;
  response.send(el.redos(request));
});

app.listen(port, () => {
  console.log(`My Practice Node Application On Port ${port}`);
});
