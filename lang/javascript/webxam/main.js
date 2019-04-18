/**
 * 参考:
 * https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
 */

const http = require('http');

const hostname = '127.0.0.1';
const port = 9292;

// Servlet的な関数群
const service = {
  hello() {
    return {
      greeting: 'Hello World'
    };
  }
};

const server = http.createServer((request, response) => {
  const {headers, method, url} = request;
  
  let body = [];
  
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    response.on('error', (err) => {
      console.error(err);
    });

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');

    const responseBody = {headers, method, url, body};
    response.write(JSON.stringify(responseBody));
    response.end();
  });

}).listen(port);
