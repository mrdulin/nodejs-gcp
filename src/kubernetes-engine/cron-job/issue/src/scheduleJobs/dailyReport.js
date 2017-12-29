const schedule = require('node-schedule');

const { sendEmail } = require('../email');
const config = require('../config');

function dailyReport() {
  console.log('Setup daily report schedule');
  const jobName = 'daily-report';
  schedule.scheduleJob(jobName, config.DAILY_REPORT_SCHEDULE, () => {
    console.log('Start daily report');
    sendEmail();
  });
}

module.exports = {
  dailyReport
};
