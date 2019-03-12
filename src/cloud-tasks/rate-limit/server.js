const bodyParser = require('body-parser');
const express = require('express');
const pkg = require('./package.json');

const sleep = require('./sleep');

const app = express();
app.enable('trust proxy');

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.get('/', (req, res) => {
  res.send(`version: ${pkg.version}`).end();
});

app.post('/createUser', async (req, res) => {
  console.log('Received task with payload: %s', req.body);

  // await sleep(3000);
  res.send(`Printed task payload: ${req.body}`).end();
});

app.get('*', (req, res) => {
  res.send('OK').end();
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
