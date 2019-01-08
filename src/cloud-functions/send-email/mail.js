const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, ACCOUNT_USER, ACCOUNT_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: ACCOUNT_USER,
    pass: ACCOUNT_PASS
  }
});

module.exports = { transporter };
