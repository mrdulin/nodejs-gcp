import faker from 'faker';

import { pubsubClient, createTopic } from '../../googlePubsub';
import { genBufferMessage, logger } from '../../utils';

async function main() {
  const topics = {
    retry: 'retry',
    deadletter: 'deadletter'
  };
  await Promise.all([createTopic(topics.retry), createTopic(topics.deadletter)]);
  const message: Buffer = genBufferMessage({ email: faker.internet.email(), retryTimes: 0 });
  pubsubClient
    .topic(topics.retry)
    .publisher()
    .publish(message)
    .then((msgId: string) => {
      logger.info(`Message ${msgId} published.`);
    })
    .catch(err => logger.error(err));
}

main();
