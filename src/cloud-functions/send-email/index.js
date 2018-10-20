const { transporter } = require('./mail');

const parsePubsubEventData = data => JSON.parse(Buffer.from(data, 'base64').toString());
const { ACCOUNT_USER, RECEVIERS } = process.env;

function sendEmail(event, callback) {
  const pubsubEvent = event.data;
  const data = parsePubsubEventData(pubsubEvent.data);
  let recievers = data.recievers || RECEVIERS;
  if (Array.isArray(recievers)) {
    recievers = recievers.join(',');
  }
  console.log('recievers:', recievers);

  const mailOptions = {
    from: ACCOUNT_USER,
    to: recievers,
    subject: data.subject,
    text: data.text
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      return callback();
    }
    console.log(`Message sent: ${info.messageId}`);
    callback();
  });
}

exports.sendEmail = sendEmail;
