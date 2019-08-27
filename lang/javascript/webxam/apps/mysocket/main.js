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
    httpServer,
    autoAcceptConnections: false // for Test
  });

  return wsServer;
};

/**
 * TODO:
 * utf8以外のデータを扱えるようにする。
 */
const handlers = {
  utf8({ connection, data }) {
    console.info(data);
    connection.sendUTF(`Server checked!: ${data}`);
  }
};

const accept = wsServer => {
  wsServer.on('request', request => {
    // TODO: Origin check

    // クライアント側でプロトコル(WebSocketコンストラクタ第2引数など)を
    // 指定していない場合はacceptの第1引数はnullを指定する。
    const connection = request.accept('my-ws', request.origin);

    connection.on('message', message => {
      if (typeof handlers[message.type] === 'function') {
        handlers[message.type]({
          connection, data: message.utf8Data
        });
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
