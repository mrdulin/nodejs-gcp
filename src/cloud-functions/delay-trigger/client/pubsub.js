const PubSub = require('@google-cloud/pubsub');

const pubsubClient = new PubSub();

function createTopic(topicName) {
  const topic = pubsubClient.topic(topicName);
  return topic
    .exists()
    .then(([exists]) => {
      if (exists) {
        return Promise.reject(`Topic '${topicName}' exists`);
      }
    })
    .then(() => pubsubClient.createTopic(topicName))
    .then(() => {
      console.log(`Create topic: ${topicName} successfully`);
    })
    .catch((error) => {
      console.log(error);
    });
}

function createSubscription(topicName, subName) {
  const subscription = pubsubClient.subscription(subName);

  return subscription
    .exists()
    .then(() => {
      if (exists) {
        return Promise.reject(`Subscription '${subName}' for topic '${topicName}' exists`);
      }
    })
    .then(() => pubsubClient.createSubscription(topicName, subName))
    .then(() => {
      console.log(`Create subscription:${subName} for topic:${topicName} successfully`);
    })
    .catch(console.log);
}

function fakePublish() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('Message was published'), 1000);
  });
}

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
  const dataBuffer = Buffer.from(jsonString);
  return dataBuffer;
}

module.exports = { createTopic, createSubscription, pubsubClient, publish, fakePublish };
