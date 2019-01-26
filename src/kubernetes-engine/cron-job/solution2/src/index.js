const { dailyReport } = require('./dailyReport');
const { sleep } = require('./util');
const config = require('./config');

(async function createJob() {
  // For testing concurrencyPolicy
  // await sleep(config.SLEEP, true);
  dailyReport();
})();
