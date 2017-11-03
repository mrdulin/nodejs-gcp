const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('GAE Cron Service test');
});

app.get('/tasks/sync', (req, res) => {
  console.log('X-Appengine-Cron', req.get('X-Appengine-Cron'), typeof req.get('X-Appengine-Cron'));
  if (req.get('X-Appengine-Cron') !== 'true') {
    return res.status(403);
  }
  console.log('Doing sync task');
  res.send('Doing sync task');
})

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});