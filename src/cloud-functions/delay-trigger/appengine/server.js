const express = require('express');
const async = require('async');

const package = require('./package.json');
const UserService = require('./userService');

const app = express();
const PORT = process.env.PORT || 8080;
const userService = new UserService();
const SCHEDULE = 60;
const n = SCHEDULE / process.env.CREATE_USER_SCHEDULER || 2;
console.log('n: ', n);

app.get('/', (req, res) => {
  res.send(`version:${package.version}`);
});

app.get('/tasks/create-user', async (req, res) => {
  async.timesSeries(
    n,
    (_, next) => userService.createUserTimeSeries(next),
    () => {
      res.sendStatus(200);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
