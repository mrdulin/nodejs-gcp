import { init, subName } from './init';
import { pullMessages } from '../../googlePubsub';

async function main() {
  await init();

  const messages = await pullMessages(subName);
  const message = JSON.parse(messages)[0];
  console.log('message.ack ', message.ack);
  console.log(messages);
}

main();
