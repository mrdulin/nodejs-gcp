const express = require('express');

const package = require('../package.json');
const config = require('./config');
const credentials = require('./credentials');

console.log('config: ', config);
console.log('credentials: ', credentials);

const app = express();

app.get('/', (req, res) => {
  res.send(`version:${package.version}`);
});

app.listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT}`);
});
