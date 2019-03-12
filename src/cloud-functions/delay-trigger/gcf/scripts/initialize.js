const { config } = require('../config');
const pubsub = require('../../pubsub');

async function initialize() {
  const batchCreateTopicPromises = [];
  const batchCreateSubPromises = [];
  config.pubsub.resources.forEach((resource) => {
    batchCreateTopicPromises.push(pubsub.createTopic(resource.topic));
    batchCreateSubPromises.push(pubsub.createSubscription(resource.topic, resource.sub));
  });

  await Promise.all(batchCreateTopicPromises);
  await Promise.all(batchCreateSubPromises);
}

initialize();
