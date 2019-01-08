import faker from 'faker';

import { logger } from '../../utils';
import { pub } from '../../googlePubsub';
import { init, topicName } from './init';

async function main() {
  await init();
  const message = { email: faker.internet.email() };

  try {
    await pub(topicName, message);
  } catch (error) {
    logger.error(error);
  }
}

main();
