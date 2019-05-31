import faker from 'faker';
import { Publisher } from '@google-cloud/pubsub';

import { pub } from '../../googlePubsub';
import { logger } from '../../utils';

async function main() {
  const topicName = 'design-mq';
  const message = { name: faker.name.findName(), email: faker.internet.email() };
  const attributes: Publisher.Attributes = { type: 'CREATE' };
  try {
    await pub(topicName, message, attributes);
  } catch (error) {
    logger.error(error);
  }
}

main();
