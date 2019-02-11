const config = require('./config');

function sendEmail(mailData) {
  const email = {
    to: mailData.to || config.EMAIL_TO,
    text: mailData.text
  };
  console.log('send email: ', email);
}

module.exports = { sendEmail };
