import { logger } from '../../utils';
import { pubsubClient } from '../../googlePubsub';
import { init, topicName } from './init';
import faker from 'faker';

async function main() {
  await init();
  const data = Buffer.from(JSON.stringify({ email: faker.internet.email() }));

  try {
    await pubsubClient
      .topic(topicName)
      .publisher()
      .publish(data);
    logger.info('publish message successfully');
  } catch (error) {
    logger.error(error);
  }
}

main();
