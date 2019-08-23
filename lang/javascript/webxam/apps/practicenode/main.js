/**
 * @fileoverview Node練習用Webアプリケーション
 */

/* eslint-env node */

const http2 = require('http2');
const express = require('express');
const MyEventLoop = require('./eventloop');
const Certs = require('../../function/certs');

const app = express();
const port = 4443;

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

app.get(`${contextRoot}eventloop/average`, async (request, response) => {
  const el = new MyEventLoop;
  response.send(await el.average(request));
});

const main = () => {
  Certs.getOptions().then(options => {
    http2.createSecureServer(options, app).listen(port);
    console.info(`My Practice Node Application On Port ${port}`);
  });
};

main();
