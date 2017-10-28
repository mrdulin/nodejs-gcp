import { Publisher } from '@google-cloud/pubsub';
import faker from 'faker';

import { logger, sleep, coin } from '../../utils';
import { createTopic, pubsubClient } from '../../googlePubsub';
import { topicName } from './constants';

function publishMessageHandler(p: Promise<any>) {
  return p
    .then((msgId: string) => {
      logger.info(`Message ${msgId} published.`);
    })
    .catch((err) => logger.error(err));
}

function genRandomDataBuffer() {
  const data = { randomEmail: faker.internet.email(), channel: coin() ? 'google' : 'fuckbook' };
  const jsonString = JSON.stringify(data);
  logger.info(`random data: ${jsonString}`);
  const dataBuffer = Buffer.from(jsonString);
  return dataBuffer;
}

async function main(options: any) {
  await createTopic(options.topic);

  const publisher: Publisher = pubsubClient.topic(options.topic).publisher({
    batching: {
      maxMessages: options.maxMessages,
      maxMilliseconds: options.maxWaitTime
    }
  });

  const tasks: any[] = [];
  for (let i = 0; i < options.repeat; i++) {
    const dataBuffer: Buffer = genRandomDataBuffer();
    tasks.push(publishMessageHandler(publisher.publish(dataBuffer)));
    await sleep(options.wait);
  }
  await Promise.all(tasks);
}

main({ topic: topicName, maxMessages: 10, maxWaitTime: 10 * 1000, repeat: 3, wait: 1000 });
