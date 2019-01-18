const express = require('express');
const path = require('path');
const package = require('../package.json');

console.log('version: ', package.version);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

const app = express();

app.get('/', (req, res) => {
  res.send(`version:${package.version}`);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
