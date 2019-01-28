const cluster = require('cluster');

const { createServer } = require('./server');
const { listenDailyReportMessage } = require('./dailyReport');
const { initPubsub } = require('./pubsub');
const config = require('./config');

(async function createApp() {
  if (config.CLUSTER_MODE === 'true') {
    if (cluster.isMaster) {
      await initPubsub();
    }
  } else {
    await initPubsub();
  }

  listenDailyReportMessage();
  createServer();
})();
