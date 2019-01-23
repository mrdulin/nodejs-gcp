const express = require('express');
const package = require('../package.json');

console.log('process.env: ', process.env);

const PORT = process.env.PORT || 8080;
const app = express();

app.get('/', (req, res) => {
  res.send(`version:${package.version}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
