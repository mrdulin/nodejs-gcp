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

const parseMessage = (data) => JSON.parse(Buffer.from(data, 'base64').toString());

async function initPubsub() {
  console.log('Initialize cloud pub/sub');
  const { topicName, subscriptionName } = constants;
  await createTopic.call(pubsubClient, topicName);
  await createSubscription.call(pubsubClient, topicName, subscriptionName);
}

module.exports = { initPubsub, pubsubClient, parseMessage };
