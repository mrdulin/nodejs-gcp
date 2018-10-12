import Pubsub from '@google-cloud/pubsub';
import path from 'path';

import { logger } from './utils';

const pubsubClient: Pubsub.PubSub = Pubsub({
  projectId: 'just-aloe-212502',
  keyFilename: path.resolve(__dirname, '../.gcp/just-aloe-212502-4bf05c82cc24.json')
});

async function createTopic(topicName: string): Promise<any> {
  const topicInstance = pubsubClient.topic(topicName);
  const [exists] = await topicInstance.exists();
  if (exists) {
    logger.info(`${topicName} topic is existed`);
    return;
  }
  return pubsubClient
    .createTopic(topicName)
    .then(data => {
      logger.info(`Create topic ${topicName} successfully`);
      return data;
    })
    .catch(err => logger.error(err));
}

async function createSubscription(topicName: string, subName: string) {
  return pubsubClient
    .createSubscription(topicName, subName)
    .then(() => {
      logger.info(`Create subscription:${subName} for topic:${topicName} successfully`);
    })
    .catch(err => logger.error(err));
}

export { createTopic, createSubscription, pubsubClient };
