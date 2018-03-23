const { PubSub } = require('@google-cloud/pubsub');

const credentials = require('./credentials');
const config = require('./config');
const constants = require('./constants');

const pubsubConfig =
  config.ENV !== 'production'
    ? {
        projectId: credentials.PROJECT_ID,
        keyFilename: credentials.KEY_FILE_NAME
      }
    : {};
const pubsubClient = new PubSub(pubsubConfig);

async function createTopic(topicName) {
  const topic = pubsubClient.topic(topicName);
  const [exists] = await topic.exists();
  if (exists) {
    console.log(`Topic ${topicName} is existed.`);
    return;
  }
  return this.createTopic(topicName)
    .then((results) => {
      const topic = results[0];
      console.log(`Topic ${topic.name} created.`);
    })
    .catch((err) => {
      console.error(`Topic ${topic.name} created error.`);
      console.error('ERROR:', err);
    });
}

async function createSubscription(topicName, subscriptionName) {
  const subscription = pubsubClient.subscription(subscriptionName);
  const [exists] = await subscription.exists();
  if (exists) {
    console.log(`Subscription ${subscriptionName} is existed.`);
    return;
  }
  return this.createSubscription(topicName, subscriptionName)
    .then((results) => {
      const sub = results[0];
      console.log(`Subscription ${sub.name} created.`);
    })
    .catch((err) => {
      console.error(`Subscription ${sub.name} created error.`);
      console.error('ERROR:', err);
    });
}

function genBufferMessage(message) {
  let jsonString;
  if (typeof message === 'string') {
    jsonString = message;
  } else if (Object.prototype.toString.call(message) === '[object Object]') {
    jsonString = JSON.stringify(message);
  } else {
    throw new Error('Wrong data type');
  }
  console.log(`Random data: ${jsonString}`);
  const dataBuffer = Buffer.from(jsonString);
  return dataBuffer;
}

function pub(topicName, message, attributes) {
  const buf = genBufferMessage(message);
  return pubsubClient
    .topic(topicName)
    .publisher()
    .publish(buf, attributes)
    .then((messageId) => {
      console.log(`Message was published with ID: ${messageId}`);
    })
    .catch((err) => {
      console.error('Message published failed.');
      console.error(err);
    });
}

const parseMessage = (data) => JSON.parse(Buffer.from(data, 'base64').toString());

async function initPubsub() {
  console.log('Initialize cloud pub/sub');
  const { topicName, subscriptionName } = constants;
  await createTopic.call(pubsubClient, topicName);
  await createSubscription.call(pubsubClient, topicName, subscriptionName);
}

module.exports = { initPubsub, pubsubClient, parseMessage, pub };
