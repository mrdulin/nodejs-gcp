const express = require('express');
const path = require('path');
const http = require('http');
const SocketIO = require('socket.io');
const faker = require('faker');

const port = process.env.PORT || 3000;
const app = express();
const server = http.Server(app);
const io = SocketIO(server);

app.use('/lib', express.static(path.resolve(__dirname, '../node_modules')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'));
});

io.on('connection', (socket) => {
  const user = { name: faker.name.findName(), email: faker.internet.email() };
  socket.emit('user', user);
  socket.on('say', (data) => {
    socket.send(data);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
