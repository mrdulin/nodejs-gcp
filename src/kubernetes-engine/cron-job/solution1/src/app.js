const cluster = require('cluster');

const { createServer } = require('./server');
const { listenDailyReportMessage } = require('./dailyReport');
const { initPubsub } = require('./pubsub');
const config = require('./config');
const credentials = require('./credentials');

(async function createApp() {
  if (cluster.isMaster) {
    console.log('config: ', config);
    console.log('credentials: ', credentials);
    await initPubsub();
  }
  listenDailyReportMessage();
  createServer();
})();
