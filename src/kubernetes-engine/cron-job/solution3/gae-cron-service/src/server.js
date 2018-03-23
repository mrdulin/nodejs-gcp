const express = require('express');

const { validateCronRequest } = require('./middlewares/validateCronRequest');
const { errorHandler } = require('./middlewares/errorHandler');
const { pub } = require('./pubsub');
const { topicName } = require('./constants');

function createServer(opts) {
  const app = express();
  const { PORT, VERSION } = opts;

  app.get('/', (req, res) => {
    res.send(`version: ${VERSION}`);
  });

  app.get('/cron/daily-report', validateCronRequest, (req, res) => {
    const message = { test: 'test data' };
    pub(topicName, message);

    res.sendStatus(200);
  });

  app.use(errorHandler);

  return app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
}

module.exports = { createServer };
