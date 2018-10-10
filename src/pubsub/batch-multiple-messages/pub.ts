import { Publisher } from '@google-cloud/pubsub';
import faker from 'faker';

import { logger, sleep } from '../../utils';
import { pubsubClient, topic } from './client';

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

function publishMessageHandler(p: Promise<any>) {
  return p
    .then(results => {
      const messageId = results[0];
      logger.info(`Message ${messageId} published.`);
    })
    .catch(err => logger.error(err));
}

function genRandomEmailDataBuffer(): Buffer {
  const data = JSON.stringify({ randomEmail: faker.internet.email() });
  return Buffer.from(data);
}

async function main(options: any) {
  await createTopic(options.topic);

  const publisher: Publisher = pubsubClient.topic(options.topic).publisher({
    batching: {
      maxMessages: options.maxMessages,
      maxMilliseconds: options.maxWaitTime
    }
  });

  logger.info('Start publish messages');
  const wait: number = 2000;
  publishMessageHandler(publisher.publish(genRandomEmailDataBuffer()));
  logger.info(`Wait ${wait} millisecond`);
  await sleep(wait);
  publishMessageHandler(publisher.publish(genRandomEmailDataBuffer()));
  logger.info(`Wait ${wait} millisecond`);
  await sleep(wait);
  publishMessageHandler(publisher.publish(genRandomEmailDataBuffer()));
  logger.info('Publish messages is finished');
}

main({ topic, maxMessages: 10, maxWaitTime: 10000 });
