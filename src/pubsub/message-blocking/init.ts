import { createTopic, createSubscription } from '../../googlePubsub';

export const TOPIC = 'message-blocking';
export const SUB = `${TOPIC}-SUB`;

async function init() {
  await createTopic(TOPIC);
  await createSubscription(TOPIC, SUB);
}

export { init };
