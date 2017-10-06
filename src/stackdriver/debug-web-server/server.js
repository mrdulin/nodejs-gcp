require('@google-cloud/debug-agent').start({
  allowExpressions: true,
  capture: { maxFrames: 20, maxProperties: 100 }
});

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const package = require('./package.json');

console.log('version: ', package.version);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`Hello from App Engine! version:${package.version}`);
});

app.get('/submit', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/form.html'));
});

app.post('/submit', (req, res) => {
  console.log({
    name: req.body.name,
    message: req.body.message
  });
  res.send('Thanks for your message!');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
