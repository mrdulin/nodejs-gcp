const express = require('express');
const package = require('../package.json');
const config = require('./config');

function createServer() {
  const app = express();

  app.get('/', (req, res) => {
    res.send(`version:${package.version}`);
  });

  return app.listen(config.PORT, () => {
    console.log(`Server listening on http://localhost:${config.PORT}`);
  });
}

module.exports = { createServer };
