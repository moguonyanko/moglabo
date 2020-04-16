/**
 * @fileoverview Node練習用Webアプリケーション
 */

/* eslint-env node */

const http2 = require('http2');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');

const Certs = require('../../function/certs');
const config = require('../../config');
const MyEventLoop = require('./eventloop');
const MyCookie = require('./cookie');

const app = express();
// signed cookieを使用するにはsecret指定が必須
app.use(cookieParser('secret'));

// POSTリクエストのBODYを解析するために必要
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.json({ type: 'application/csp-report' }));

const port = config.port.practicenode;

const contextName = 'webxam';
const contextRoot = `/${contextName}/apps/`;
const practiceNodeRoot = `${contextRoot}practicenode/`;

const corsCheck = (request, callback) => {
  const origin = request.get('Origin');
  if (config.cors.whitelist.indexOf(origin) >= 0 || !origin) {
    callback(null, {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'HEAD'],
      allowedHeaders: ['Content-Type']
    });
  } else {
    callback(new Error('Invalid origin'), {
      origin: false
    });
  }
};

app.get(practiceNodeRoot, (request, response) => {
  response.send('Practice Node');
});

app.get(`${practiceNodeRoot}hello`, (request, response) => {
  console.log(`Query: ${request.query}`);
  response.send('Hello Node World');
});

app.get(`${practiceNodeRoot}eventloop/redos`, (request, response) => {
  const el = new MyEventLoop;
  response.send(el.redos(request));
});

app.get(`${practiceNodeRoot}eventloop/average`, async (request, response) => {
  const el = new MyEventLoop;
  response.send(await el.average(request));
});

app.get(`${practiceNodeRoot}cookie/echo`, async (request, response) => {
  const mc = new MyCookie({ request, response });
  response.send(JSON.stringify(mc.echo()));
});

app.get(`${practiceNodeRoot}cookie/sampleuser`, cors(corsCheck),
  async (request, response) => {
    const mc = new MyCookie({ request, response });
    console.log(mc.echo());
    response.send(JSON.stringify(mc.sampleUser));
  });

app.post(`${practiceNodeRoot}cspreport`, (request, response) => {
  console.log(request.body['csp-report']);
  response.send(JSON.stringify({ status: 200 }));
});

app.get(`${practiceNodeRoot}shorturl`, cors(corsCheck),
  (request, response) => {
    // test[2]=1のようなパラメータは自動的に配列として処理されてしまう。
    // https://expressjs.com/en/api.html#req.query
    const obj = {
      param: request.query
    };
    response.send(JSON.stringify(obj));
  });

const main = () => {
  Certs.getOptions().then(options => {
    http2.createSecureServer(options, app).listen(port);
    console.info(`My Practice Node Application On Port ${port}`);
  });
};

main();
