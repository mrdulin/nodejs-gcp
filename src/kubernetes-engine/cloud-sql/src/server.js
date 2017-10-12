const express = require('express');

const package = require('../package.json');
const config = require('./config');

const { knex } = require('./database/connection');

function createServer() {
  const app = express();

  app.get('/', (req, res) => {
    res.send(`version:${package.version}`);
  });

  app.get('/user', async (req, res) => {
    const sql = `
      SELECT * FROM users;
    `;
    const users = await knex.raw(sql).get('rows');
    res.send({ users });
  });

  return app.listen(config.PORT, () => {
    console.log(`Server listening on http://localhost:${config.PORT}`);
  });
}

module.exports = { createServer };
