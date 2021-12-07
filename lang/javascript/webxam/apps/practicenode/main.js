/**
 * @fileoverview Node練習用Webアプリケーション
 */

/* eslint-env node */

const http2 = require('http2');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('../../config');
const MyEventLoop = require('./eventloop');
const MyCookie = require('./cookie');

const Certs = require('../../function/certs');
const CreateImage = require('../../function/createimage');
const Inouts = require('../../function/inouts');

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
  response.setHeader('Content-Type', 'application/json');
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

app.get(`${practiceNodeRoot}reversestring`, cors(corsCheck),
  (request, response) => {
    const string = request.query.string;
    response.send(JSON.stringify({
      result: string.split('').reverse().join('')
    }));
  });

app.post(`${practiceNodeRoot}verifycode`, cors(corsCheck),
  (request, response) => {
    const code = request.body.code;
    const result = {
      result: !isNaN(parseInt(code))
    };
    response.json(result);
  });

app.get(`${practiceNodeRoot}createimage`, cors(corsCheck),
  async (request, response) => {
    const { format, width, height } = request.query;
    const buffer = await CreateImage.draw({
      format, width, height
    });
    response.setHeader('Content-Type', `image/${format}`);
    response.send(buffer);
  });

const setCacheNoStoreHeader = (response, time) => {
  response.setHeader('Cache-Control', `no-store,max-age=0`);
  // Cache-Control以外を設定した時にキャッシュが無効化されるかどうかのテスト
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', time);
  response.setHeader('Last-Modified', time);
  response.setHeader('Vary', 'Origin');
  // ETagを除去してブラウザキャッシュの振る舞いを調べる。
  response.removeHeader('ETag');
};

app.get(`${practiceNodeRoot}currenttime`, cors(corsCheck),
  (request, response) => {
    const time = new Date().toUTCString();
    console.log(`Called currenttime`);
    setCacheNoStoreHeader(response, time);
    response.json({
      result: time
    });
  });

app.get(`${practiceNodeRoot}sampleimage`, cors(corsCheck),
  async (request, response) => {
    const time = new Date().toUTCString();
    console.log(`Called sampleimage`);
    setCacheNoStoreHeader(response, time);
    const buffer = await Inouts.readFile('image/testimage.png');
    response.setHeader('Content-Type', 'image/png');
    response.send(buffer);
  });

app.get(`${practiceNodeRoot}meaning`, cors(corsCheck),
  (request, response) => {
    const { keyword } = request.query;
    const target = `https://www.google.com/search?q=${keyword}`;
    response.redirect(target);
  });

app.get(`${practiceNodeRoot}random`, cors(corsCheck),
  (request, response) => {
    response.setHeader('Cache-Control', 'max-age=10,stale-while-revalidate=30');
    response.setHeader('Content-Type', 'application/json');
    const { limit } = request.query;
    response.send({
      value: parseInt(Math.random() * limit)
    });
  })

app.get(`${practiceNodeRoot}imagebuffer`, cors(corsCheck),
  async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'application/octet-stream');

    const canvas = require('canvas').createCanvas(400, 400);
    const ctx = canvas.getContext('2d');
    ctx.fillRect(100, 100, 200, 200);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    response.send(imageData.data); 
  });

const main = () => {
  Certs.getOptions().then(options => {
    http2.createSecureServer(options, app).listen(port);
    console.info(`My Practice Node Application On Port ${port}`);
  });
};

main();
