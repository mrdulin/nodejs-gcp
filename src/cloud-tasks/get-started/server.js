const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.enable('trust proxy');

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.get('/', (req, res) => {
  // Basic index to verify app is serving
  res.send('Hello, World!').end();
});

app.post('/log_payload', (req, res) => {
  // Log the request payload
  console.log('Received task with payload: %s', req.body);
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
