import { init, TOPIC } from './init';
import { pub } from '../../googlePubsub';

async function main() {
  await init();
  const message = 'Hello, world!';
  pub(TOPIC, message);
}

main();
