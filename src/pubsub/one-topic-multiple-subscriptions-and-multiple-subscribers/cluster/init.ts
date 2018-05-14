import { createTopic, createSubscription } from '../../../googlePubsub';

export const TOPIC = 'cluster';
export const SUB_A = `${TOPIC}-SUB_A`;
export const SUB_B = `${TOPIC}-SUB_B`;

async function init() {
  await createTopic(TOPIC);
  await Promise.all([createSubscription(TOPIC, SUB_A), createSubscription(TOPIC, SUB_B)]);
}

export { init };
