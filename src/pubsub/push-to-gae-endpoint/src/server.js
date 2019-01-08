const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { pubsubClient, tName } = require('./pubsub');

const PUBSUB_VERIFICATION_TOKEN = 'hangjie';

function server(options) {
  const app = express();
  const { PORT } = options;
  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, './views'));

  const messages = [{ name: 'test', email: 'test@qq.com' }];

  app.get('/', (req, res) => {
    res.render('index', { messages });
  });

  app.post('/', bodyParser.urlencoded({ extended: false }), (req, res) => {
    console.log(req.body);
    if (!req.body.username) {
      res.status(400).send('Missing username');
      return;
    }
    if (!req.body.email) {
      res.status(400).send('Missing email');
      return;
    }

    const message = Buffer.from(JSON.stringify(req.body));
    pubsubClient
      .topic(tName)
      .publisher()
      .publish(message)
      .then((messageId) => {
        const logMsg = `Message was sent with ID: ${messageId}`;
        console.log(logMsg);
        res.redirect('/');
      });
  });

  app.post('/_ah/push-handlers/createUser', bodyParser.json(), (req, res) => {
    console.log('token: ', req.query.token);
    if (req.query.token !== PUBSUB_VERIFICATION_TOKEN) {
      res.sendStatus(400);
      return;
    }

    const message = Buffer.from(req.body.message.data, 'base64').toString();
    console.log('message: ', message);
    messages.push(message);
    res.sendStatus(200);
  });

  return app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = {
  server
};
