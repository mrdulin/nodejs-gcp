import faker from 'faker';

import { init, TOPIC } from './init';
import { pub } from '../../googlePubsub';

async function main() {
  await init();

  for (let i = 0; i < 3; i++) {
    const message = { name: faker.name.findName() };
    pub(TOPIC, message);
  }
}

main();
