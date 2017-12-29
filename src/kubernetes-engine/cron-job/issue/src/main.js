const { createServer } = require('./server');
const { dailyReport } = require('./scheduleJobs/dailyReport');

(function main() {
  dailyReport();
  createServer();
})();
