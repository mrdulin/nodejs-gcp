const PubSub = require('@google-cloud/pubsub');

const pubsubClient = new PubSub();

function publish(topicName, message, attributes) {
  const buf = genBufferMessage(message);

  return pubsubClient
    .topic(topicName)
    .publisher()
    .publish(buf, attributes)
    .then((messageId) => {
      console.info(`Message was published with ID: ${messageId}`);
    })
    .catch((error) => {
      console.error('Publish message failed.');
      console.error(error);
      return Promise.reject(error);
    });
}

function genBufferMessage(message) {
  let jsonString;
  if (typeof message === 'string') {
    jsonString = message;
  } else if (Object.prototype.toString.call(message) === '[object Object]') {
    jsonString = JSON.stringify(message);
  } else {
    throw new TypeError('Wrong data type');
  }
  return Buffer.from(jsonString);
}

module.exports = { pubsubClient, publish };
