const express = require('express');

const package = require('./package.json');
const UserService = require('./userService');

const app = express();
const PORT = process.env.PORT || 8080;
const userService = new UserService();

app.get('/', (req, res) => {
  res.send(`version:${package.version}`);
});

app.get('/tasks/create-user', (req, res) => {
  userService.createUser();
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
