import { init, TOPIC } from './init';
import { pub } from '../../googlePubsub';

async function main() {
  await init();

  setInterval(() => {
    const message = `Hello, world! - ${Date.now()}`;
    pub(TOPIC, message);
  }, 1000);
}

main();
