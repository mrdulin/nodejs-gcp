const pubsub = require('../pubsub');

const messageProcess = (event, callback) => {
  const pubsubMessage = event.data;
  console.log('pubsubMessage: ', pubsubMessage);
  const message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('message: ', message);

  // TODO
  // pubsub.pull();

  callback();
};

module.exports = messageProcess;
