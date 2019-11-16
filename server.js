const http = require('http');
const app = require('./src/backend/app');

const port = process.env.PORT || 4200

app.set('port',port)

const server = http.createServer(app)

server.listen(port);