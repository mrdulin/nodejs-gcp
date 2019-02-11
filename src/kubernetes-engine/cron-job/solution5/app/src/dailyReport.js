const { sendEmail } = require('./email');

function dailyReport(message) {
  console.log(`[${new Date().toISOString()}] Start daily report`);
  const mailData = { to: message.to, text: 'test data' };
  sendEmail(mailData);
}

module.exports = { dailyReport };
