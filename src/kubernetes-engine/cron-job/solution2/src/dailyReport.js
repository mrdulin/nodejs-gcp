const { sendEmail } = require('./email');

function dailyReport() {
  console.log(`[${new Date().toISOString()}] Start daily report`);
  const mailData = { test: 'test data' };
  sendEmail(mailData);
}

module.exports = { dailyReport };
