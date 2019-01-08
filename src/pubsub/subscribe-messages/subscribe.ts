import { Topic, Subscription } from '@google-cloud/pubsub';

import { logger } from '../../utils';
import { pubsubClient } from '../../googlePubsub';
import { topicName, subName, init } from './init';

async function main() {
  await init();
  const topic: Topic = pubsubClient.topic(topicName);
  const subscription: Subscription = topic.subscription(subName);

  const onMessage = (message: any) => {
    logger.info(message);
    logger.info(`message.id: ${message.id}`);
    logger.info(`message.ackId: ${message.ackId}`);
    logger.info(`message.data: ${message.data}`);
    logger.info(`message.attributes: ${JSON.stringify(message.attributes, null, 2)}`);
    logger.info(`message.received: ${message.received}`);
    console.log('ack: ', message.ack());
  };

  subscription.on('message', onMessage);
  subscription.on('error', (err: Error) => logger.error(err));
}

main();
