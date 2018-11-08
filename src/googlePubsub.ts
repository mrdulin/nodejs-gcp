import Pubsub, { Publisher } from '@google-cloud/pubsub';
import path from 'path';

import { logger, genBufferMessage } from './utils';

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
    .then((data) => {
      logger.info(`Create topic ${topicName} successfully`);
      return data;
    })
    .catch((err) => logger.error(err));
}

async function createSubscription(topicName: string, subName: string, verbose: boolean = true) {
  return pubsubClient
    .createSubscription(topicName, subName)
    .then(() => {
      if (verbose) {
        logger.info(`Create subscription:${subName} for topic:${topicName} successfully`);
      }
    })
    .catch((err) => {
      if (verbose) {
        logger.error(`Create subscription:${subName} for topic:${topicName} failed. ${err}`);
      }
    });
}

async function deleteSubsciption(topicName: string, subName: string, verbose: boolean = true) {
  return pubsubClient
    .subscription(subName)
    .delete()
    .then(() => {
      if (verbose) {
        logger.info(`Delete subscription:${subName} for topic:${topicName} successfully`);
      }
    })
    .catch((err) => {
      if (verbose) {
        logger.error(`Delete subscription:${subName} for topic:${topicName} failed. ${err}`);
      }
    });
}

async function clearAllMessages(topicName: string, subName: string) {
  await deleteSubsciption(topicName, subName, false);
  await createSubscription(topicName, subName, false);
  logger.info(`Clear all messages of topic:${topicName} successfully`);
}

async function pub(topicName: string, message: any, attributes: Publisher.Attributes) {
  const buf: Buffer = genBufferMessage(message);
  return pubsubClient
    .topic(topicName)
    .publisher()
    .publish(buf, attributes)
    .then((messageId) => {
      logger.info(`Message ${messageId} published`);
    });
}

export { createTopic, createSubscription, deleteSubsciption, clearAllMessages, pubsubClient, pub };
