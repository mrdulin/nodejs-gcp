import { SUB, init } from './init';
import { pubsubClient } from '../../googlePubsub';
import { logger } from '../../utils';

async function main() {
  await init();
  // 竞争关系，只有一个subscriber收到消息
  pubsubClient.subscription(SUB).on('message', (message) => {
    logger.info(`subscriber A receieve message from sub:${SUB}. message: ${JSON.stringify(message)}`);
    message.ack();
  });
  pubsubClient.subscription(SUB).on('message', (message) => {
    logger.info(`subscriber B receieve message from sub:${SUB}. message: ${JSON.stringify(message)}`);
    message.ack();
  });
}

main();
