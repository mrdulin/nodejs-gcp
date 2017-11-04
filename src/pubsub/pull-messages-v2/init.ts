import { createSubscription, createTopic } from '../../googlePubsub';

const topicName = 'pull-messages-v2';
const subName = 'pull-messages-v2-sub';

async function init() {
  await createTopic(topicName);
  await createSubscription(topicName, subName);
}

export { init, topicName, subName };
