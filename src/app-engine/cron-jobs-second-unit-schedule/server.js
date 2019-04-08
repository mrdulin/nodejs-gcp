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

app.get('/version', (req, res) => {
  res.send(`version: ${pkg.version}`);
});

app.get('/cronjob/sync', validateCronRequest, (req, res) => {
  console.log('Doing sync task');
  res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
