import { createTopic, createSubscription } from '../../googlePubsub';

export const TOPIC = 'one-topic-one-subscription-and-multiple-subscribers';
export const SUB = `${TOPIC}-SUB`;

async function init() {
  await createTopic(TOPIC);
  await createSubscription(TOPIC, SUB);
}

export { init };
