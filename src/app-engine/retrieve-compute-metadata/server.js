const express = require('express');

const package = require('./package.json');
const { retrieveMetaData, metadata } = require('./metadata');

const app = express();
app.enable('trust proxy');

app.get('/', (req, res) => {
  res.send(`version:${package.version}`);
});

app.get('/metadata', async (req, res) => {
  const metadata = await retrieveMetaData();
  console.log('metadata: ', metadata);
  res.send(metadata);
});

app.get('/metadata-once', async (req, res) => {
  const envVars = await metadata;
  console.log('metadata once: ', envVars);
  res.send(envVars);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
