import { SUB_A, SUB_B, init } from './init';
import { pubsubClient } from '../../googlePubsub';
import { logger } from '../../utils';

async function main() {
  await init();
  pubsubClient.subscription(SUB_A).on('message', message => {
    logger.info(`receieve message from sub:${SUB_A}. message: ${message}`);
    message.ack();
  });
  pubsubClient.subscription(SUB_B).on('message', message => {
    logger.info(`receieve message from sub:${SUB_B}. message: ${message}`);
    message.ack();
  });
}

main();
