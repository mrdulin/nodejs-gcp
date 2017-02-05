import { createTopic, createSubscription } from '../../googlePubsub';

const topicName = 'subscribe-messages';
const subName = 'subscribe-messages-sub';

async function init() {
  await createTopic(topicName);
  await createSubscription(topicName, subName);
}

export { topicName, subName, init };
