//  server.js
const http = require('http');

const fs = require('fs');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer(function handler(req, res) {
    fs.readFile('index.html', 'utf8', function(err, data){
        res.write(data);
        res.end();
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
