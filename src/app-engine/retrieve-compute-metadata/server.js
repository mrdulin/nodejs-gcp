const express = require('express');

const package = require('./package.json');
const { retrieveMetaData } = require('../../metadata');

const app = express();
app.get('/', (req, res) => {
  res.send(`version:${package.version}`);
});

app.get('/', async (req, res) => {
  const metadata = await retrieveMetaData();
  res.json(metadata);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
