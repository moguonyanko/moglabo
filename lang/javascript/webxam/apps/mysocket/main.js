/**
 * @fileoverview WebSocket練習用アプリケーション
 * 
 * 参考:
 * https://www.npmjs.com/package/websocket
 * https://github.com/theturtle32/WebSocket-Node/blob/HEAD/docs/index.md
 */

/* eslint-env node */

const WebSocketServer = require('websocket').server;
const http2 = require('http2');

const Certs = require('../../function/certs');
const config = require('../../config');

const port = config.port.mysocket;

const createMySocketServer = options => {
  const httpServer = http2.createSecureServer(options,
    (request, response) => {
      console.info(`${new Date}: ${request.url}`);
      response.writeHead(404);
      response.end();
    });
  httpServer.listen(port, () => {
    console.info(`My WebSocket App server listen by ${port}`);
  });

  const wsServer = new WebSocketServer({
    httpServer
  });

  return wsServer;
};

/**
 * クライアントから渡されたデータをそのまま返しているだけ。
 */
const handlers = {
  utf8({ connection, data }) {
    connection.sendUTF(data);
  },
  binary({connection, data}) {
    connection.sendBytes(data);
  }
};

const getData = {
  utf8(message) {
    return message.utf8Data;
  },
  binary(message) {
    return message.binaryData;
  }
};

const validOrigins = [
  'https://localhost'
];

const accept = wsServer => {
  wsServer.on('request', request => {
    if (!validOrigins.includes(request.origin)) {
      console.error(`Invalid origin: ${request.origin}`);
      request.reject();
      return;
    }

    // クライアント側でプロトコル(WebSocketコンストラクタ第2引数など)を
    // 指定していない場合はacceptの第1引数はnullを指定する。
    const connection = request.accept('my-ws', request.origin);

    connection.on('message', message => {
      const type = message.type;
      if (typeof handlers[type] === 'function') {
        const data = getData[type](message);
        handlers[type]({ connection, data });
      } else {
        request.reject();
        console.error(`Unsupported type: ${message.type}`);
      }
    });

    connection.on('close', (code, description) => {
      console.info(`WebSocket server closed: ${code}:${description}`);
    });
  });
};

const main = () => {
  Certs.getOptions().then(options => {
    const wsServer = createMySocketServer(options);
    accept(wsServer);
  });
};

main();
