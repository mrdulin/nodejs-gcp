import PubSub from '@google-cloud/pubsub';
import { Topic, Publisher } from '@google-cloud/pubsub';

import { logger } from '../../utils';

const pubsub: PubSub.PubSub = PubSub();
const topic: Topic = pubsub.topic('lin-topic');
const publisher: Publisher = topic.publisher();

const data: Buffer = Buffer.from('Hello, world!');

publisher.publish(data, (error: Error | null, messageId: string) => {
  if (error) {
    logger.error(error);
    return;
  }
  logger.info(`messageId: ${messageId}`);
});
