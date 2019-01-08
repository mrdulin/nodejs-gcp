import { createTopic, createSubscription } from '../../googlePubsub';

export const TOPIC = 'modify-ack-deadline';
export const SUB = TOPIC;

async function init() {
  await createTopic(TOPIC);
  await createSubscription(TOPIC, SUB);
}

export { init };
