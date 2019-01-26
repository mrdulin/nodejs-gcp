const config = require('./config');

function sendEmail(mailData) {
  const email = {
    to: config.EMAIL_TO,
    text: mailData
  };
  console.log('send email: ', email);
}

module.exports = { sendEmail };
