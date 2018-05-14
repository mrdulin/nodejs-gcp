import faker from 'faker';

import { init, TOPIC } from './init';
import { pub } from '../../../googlePubsub';

async function main() {
  await init();
  setInterval(() => {
    const message = { data: faker.lorem.word() };
    pub(TOPIC, message);
  }, 5000);
}

main();
