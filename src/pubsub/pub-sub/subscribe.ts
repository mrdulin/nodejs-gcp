import PubSub from '@google-cloud/pubsub';
import { Topic, Subscription } from '@google-cloud/pubsub';

import { logger } from '../../utils';

const pubsub: PubSub.PubSub = PubSub();
const topic: Topic = pubsub.topic('lin-topic');
const subscription: Subscription = topic.subscription('lin-sub');

subscription.on('error', (err: Error) => logger.error(err));

logger.info('subscribe lin-topic: ');

const onMessage = (message: any) => {
  logger.info(message);
  logger.info(`message.id: ${message.id}`);
  logger.info(`message.ackId: ${message.ackId}`);
  logger.info(`message.data: ${message.data}`);
  logger.info(`message.attributes: ${JSON.stringify(message.attributes, null, 2)}`);
  logger.info(`message.received: ${message.received}`);
  message.ack();
};

subscription.on('message', onMessage);
