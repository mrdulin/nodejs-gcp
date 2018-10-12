import { logger } from '../../utils';
import { createSubscription, pubsubClient } from '../../googlePubsub';
import { topicName, subName } from './constants';

async function main() {
  await createSubscription(topicName, subName);
  const subscription = pubsubClient.subscription(subName);
  subscription.on('message', msg => {
    const data = msg.data.toString();
    logger.info(`msg.id: ${msg.id}`);
    logger.info(`msg.publishTime: ${msg.publishTime}`);
    logger.info(`msg.data: ${data}`);
    msg.ack();
  });
}

main();
