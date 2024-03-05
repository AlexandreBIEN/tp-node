//  server.js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function handler(req, res) {
    res.statusCode = 200;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: 'Hello World!',
    }));
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});