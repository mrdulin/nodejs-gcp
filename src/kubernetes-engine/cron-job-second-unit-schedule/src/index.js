const async = require('async');

const OUTER_SCHEDULE = 60;
const INNER_SCHEDULE = 10;

async function main() {
  try {
    await updateDBTimeSeries();
    console.log('A round update database operations done.');
  } catch (error) {
    console.error(error);
  }
}

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
        resolve(results);
      }
    );
  });
}

main();
