const express = require('express');
const pkg = require('./package.json');

const app = express();

function validateCronRequest(req, res, next) {
  console.log('X-Appengine-Cron', req.get('X-Appengine-Cron'), typeof req.get('X-Appengine-Cron'));
  if (req.get('X-Appengine-Cron') !== 'true') {
    return res.status(403);
  }
  next();
}

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/version', (req, res) => {
  res.send(`version: ${pkg.version}`);
});

app.get('/tasks/sync', validateCronRequest, (req, res) => {
  console.log('Doing sync task');
  res.sendStatus(200);
});

app.get('/cron/events/:topic/:retryTopic', validateCronRequest, (req, res) => {
  console.log(`req.params: ${JSON.stringify(req.params)}`);
  res.sendStatus(200);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
