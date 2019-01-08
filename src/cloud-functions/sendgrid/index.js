const client = require('@sendgrid/client');
const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY, SEND_TO, SEND_FROM } = process.env;
client.setApiKey(SENDGRID_API_KEY);
sgMail.setApiKey(SENDGRID_API_KEY);

function sendEmailBySendgrid(req, res) {
  console.log('req.body: ', req.body);

  let msg;
  return Promise.resolve()
    .then(() => {
      if (req.method !== 'POST') {
        const error = new Error('Only POST requests are accepted');
        error.code = 405;
        return Promise.reject(error);
      }
      msg = getMsg(req.body);
      console.log(`Sending email to: ${msg.to}`);
      return sgMail.send(msg);
    })
    .then(([response]) => {
      if (response.statusCode < 200 || response.statusCode >= 400) {
        const error = new Error(response.body);
        error.code = response.statusCode;
        return Promise.reject(error);
      }
      console.log(`Send email address to ${msg.to} success.`);
      res.status(response.statusCode);
      if (response.headers['content-type']) {
        res.set('content-type', response.headers['content-type']);
      }
      if (response.headers['content-length']) {
        res.set('content-length', response.headers['content-length']);
      }
      res.json({ result: response.body || null });
    })
    .catch((err) => {
      console.error(err);
      const code = err.code || (err.response ? err.response.statusCode : 500) || 500;
      res.status(code).send(err.message);
    });
}

function getMsg(body) {
  return {
    to: body.to || SEND_TO,
    from: body.from || SEND_FROM,
    subject: body.subject,
    text: body.text,
    html: body.html
  };
}

exports.sendEmailBySendgrid = sendEmailBySendgrid;
