/**
 * 参考:
 * https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
 */

const http = require('http');

// Servlet的な関数群
const service = {
  hello() {
    return {
      value: 'Hello Node!'
    };
  }
};

const handleError = err => console.error(err);

http.createServer((request, response) => {
  const {headers, method, url} = request;
  
  let body = {};
  
  const paths = url.split('/service/');
  if (paths.length > 1 && typeof service[paths[1]] === 'function') {
    body = service[paths[1]]();
  }
  
  request.on('error', handleError).on('data', chunk => {
    // このブロックがないとレスポンスが返されずブロックされたままになる。
    // バイナリを返す時以外は何もしなくてよい？
    //body.push(chunk);
  }).on('end', () => {
    // バイナリを返す時に使う？
    //body = Buffer.concat(body).toString();

    response.on('error', handleError);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(body));
    response.end();
  });

}).listen(3000);
