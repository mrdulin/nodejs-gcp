import { init, TOPIC } from './init';
import { pubsubClient } from '../../googlePubsub';
import { logger } from '../../utils';

async function main() {
  await init();
  logger.info(`start to publish message to topic:${TOPIC}`);

  const data: Buffer = Buffer.from('Hello, world!');
  pubsubClient
    .topic(TOPIC)
    .publisher()
    .publish(data)
    .then(messageId => {
      logger.info(`publish messasge successfully. messageId: ${messageId}`);
    })
    .catch(err => {
      logger.error(`publish messasge failed. ${err}`);
    });
}

main();
