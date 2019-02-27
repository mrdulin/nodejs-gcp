const express = require('express');
const async = require('async');

const pkg = require('./package.json');
const app = express();

const OUTER_SCHEDULE = 60; // 1 minute
const INNER_SCHEDULE = 10; // 10 seconds

function validateCronRequest(req, res, next) {
  // console.log('X-Appengine-Cron', req.get('X-Appengine-Cron'), typeof req.get('X-Appengine-Cron'));
  if (process.env.NODE_ENV === 'production') {
    if (req.get('X-Appengine-Cron') !== 'true') {
      return res.status(403);
    }
  }

  next();
}

app.get('/version', (req, res) => {
  res.send(`version: ${pkg.version}`);
});

app.get('/cronjob/sync', validateCronRequest, async (req, res) => {
  // Update database every 1 minute
  // await updateDB();

  // Update database every 10 seconds
  try {
    await updateDBTimeSeries();
  } catch (error) {
    console.error(error);
  }
  res.sendStatus(200);
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function updateDB() {
  return new Promise((resolve) => {
    process.nextTick(() => {
      console.log('Update database success.');
      resolve();
    });
  });
}

async function updateDBEveryTenSeconds(item, n, next) {
  // console.log('item: ', item);
  await updateDB();
  if (item < n - 1) {
    await sleep(INNER_SCHEDULE * 1000);
  }
  next();
}

async function updateDBTimeSeries() {
  const n = OUTER_SCHEDULE / INNER_SCHEDULE;
  return new Promise((resolve, reject) => {
    async.timesSeries(
      n,
      (item, next) => updateDBEveryTenSeconds(item, n, next),
      (error, results) => {
        if (error) {
          return reject(error);
        }
        console.log('A round update database operations done.');
        resolve(results);
      }
    );
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
