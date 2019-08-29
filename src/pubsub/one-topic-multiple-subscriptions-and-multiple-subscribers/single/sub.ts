import { SUB_A, SUB_B, init } from './init';
import { sub } from '../../../googlePubsub';
import { logger } from '../../../utils';

async function main() {
  await init();
  sub(SUB_A, (message) => {
    logger.info(`receieve message from sub:${SUB_A}. message: ${JSON.stringify(message)}`);
    message.ack();
  });
  setTimeout(() => {
    sub(SUB_B, (message) => {
      logger.info(`receieve message from sub:${SUB_B}. message: ${JSON.stringify(message)}`);
      message.ack();
    });
  }, 2000);
}

main();
