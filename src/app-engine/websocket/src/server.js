const express = require('express');
const SocketIO = require('socket.io');
const http = require('http');
const path = require('path');
const faker = require('faker');

const package = require('../package.json');

console.log('version: ', package.version);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.Server(app);
const io = SocketIO(server);

app.use('/lib', express.static(path.resolve(__dirname, '../node_modules')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.get('/version', (req, res) => {
  res.send(`version:${package.version}`);
});

io.on('connection', (socket) => {
  const user = { name: faker.name.findName(), email: faker.internet.email() };
  socket.emit('user', user);
  socket.on('say', (data) => {
    console.log('say: ', data);
    socket.send(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
