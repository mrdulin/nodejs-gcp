const Pubsub = require('@google-cloud/pubsub');

const pubsubClient = new Pubsub();
const tName = 'push-to-gae-endpoint';
const sName = `${tName}-sub`;

(async function init() {
  await createTopic(tName);
  await createSubscription(tName, sName);
})();

async function createTopic(topicName) {
  const topic = pubsubClient.topic(topicName);
  const [exists] = await topic.exists();
  if (exists) {
    return;
  }
  try {
    await pubsubClient.createTopic(topicName);
    console.log(`Create topic: ${topicName} successfully`);
  } catch (error) {
    console.error(error);
  }
}

async function createSubscription(topicName, subName) {
  const subscription = pubsubClient.subscription(subName);
  const [exists] = await subscription.exists();
  if (exists) {
    return;
  }
  try {
    await pubsubClient.createSubscription(topicName, subName);
    console.log(`Create subscription:${subName} for topic:${topicName} successfully`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { pubsubClient, tName };
