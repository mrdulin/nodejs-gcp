import faker from 'faker';

import { logger } from '../../utils';
import { topicName, init } from './init';
import { pub } from '../../googlePubsub';

async function main() {
  await init();

  const message = {
    name: faker.name.findName(),
    email: faker.internet.email()
  };
  try {
    await pub(topicName, message);
  } catch (error) {
    logger.error(error);
  }
}

main();
