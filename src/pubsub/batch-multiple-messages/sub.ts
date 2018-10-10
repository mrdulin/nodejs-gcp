import Pubsub from '@google-cloud/pubsub';

import { pubsubClient, topic, sub } from './client';
import { logger } from '../../utils';

async function createSubscription(topicName: string, name: string) {
  return pubsubClient
    .createSubscription(topicName, name)
    .then(() => {
      logger.info(`Create subscription:${name} for topic:${topicName} successfully`);
    })
    .catch(err => logger.error(err));
}

async function main() {
  await createSubscription(topic, sub);

  const subscription = pubsubClient.subscription(sub);

  subscription.on('message', msg => {
    const data = msg.data.toString();
    logger.info(`msg.id: ${msg.id}`);
    logger.info(`msg.publishTime: ${msg.publishTime}`);
    logger.info(`msg.data: ${data}`);
    msg.ack();
  });
}

main();
