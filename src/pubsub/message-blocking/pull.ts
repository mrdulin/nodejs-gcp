import { pullMessages } from '../../googlePubsub';
import { SUB } from './init';
import { logger } from '../../utils';

async function main() {
  const maxMessages = 100;
  setInterval(async () => {
    const messagesString = await pullMessages(SUB, maxMessages);
    const messages = JSON.parse(messagesString);
    console.log(messagesString);
    console.log('total messsage: ', messages.length);
  }, 1 * 500);
}

main();
