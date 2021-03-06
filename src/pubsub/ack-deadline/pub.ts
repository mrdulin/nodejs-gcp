import { init, TOPIC } from './init';
import { pub } from '../../googlePubsub';
import faker from 'faker';

async function main() {
  await init();

  const message = { data: faker.lorem.word() };
  pub(TOPIC, message);
}

main();
