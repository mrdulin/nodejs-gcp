const Pubsub = require('@google-cloud/pubsub');
const path = require('path');

const PROD = process.env.NODE_ENV === 'production';

const options = PROD
  ? {}
  : {
      projectId: 'just-aloe-212502',
      keyFilename: path.resolve(__dirname, '../../../.gcp/just-aloe-212502-4bf05c82cc24.json')
    };

const pubsubClient = new Pubsub(options);
const subscribeClient = new Pubsub.v1.SubscriberClient(options);

const createEmailRetryTopicName = 'createEmail-retry';
const createEmailRetrySubName = 'createEmail-retry-sub';

const createEmailTopicName = 'createEmail';
const createEmailSubName = 'createEmail-sub';

const deadletterTopicName = 'deadletter';

async function createSubscription(topicName, subName) {
  const subscription = pubsubClient.topic(topicName).subscription(subName);
  const [exists] = await subscription.exists();
  if (exists) {
    console.log(`${subName} subscription is existed for topic: ${topicName}`);
    return;
  }
  try {
    await pubsubClient.createSubscription(topicName, subName);
    console.log(`create subscription:${subName} for topic:${topicName} success`);
  } catch (error) {
    console.log(error);
  }
}

async function createTopic(topicName) {
  const topicInstance = pubsubClient.topic(topicName);
  const [exists] = await topicInstance.exists();
  if (exists) {
    console.log(`${topicName} topic is existed`);
    return;
  }
  return pubsubClient
    .createTopic(topicName)
    .then(data => {
      console.log(`Create topic ${topicName} successfully`);
      return data;
    })
    .catch(err => console.log(err));
}

async function pub(topicName, message) {
  try {
    const dataBuf = Buffer.from(JSON.stringify(message));
    await pubsubClient
      .topic(topicName)
      .publisher()
      .publish(dataBuf);
    console.log(`publish message to topic:${topicName} success.`);
  } catch (error) {
    console.error(`publish message to topic:${topicName} failed.`, error);
  }
}

async function init() {
  await createTopic(createEmailRetryTopicName);
  await createSubscription(createEmailRetryTopicName, createEmailRetrySubName);
  await createTopic(createEmailTopicName);
  await createSubscription(createEmailTopicName, createEmailSubName);
}

init();

module.exports = {
  subscribeClient,
  pubsubClient,
  createEmailRetryTopicName,
  createEmailRetrySubName,
  createEmailTopicName,
  createEmailSubName,
  deadletterTopicName,
  pub
};
