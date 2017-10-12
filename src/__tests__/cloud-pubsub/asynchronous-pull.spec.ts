import {
  createTopic,
  createSubscription,
  pubsubClient,
  pub,
  IMessage,
  parseMessageData,
  subscriberClient
} from '../../googlePubsub';
import { Topic, Subscription } from '@google-cloud/pubsub';
import { logger, sleep } from '../../utils';
import faker = require('faker');
import { credentials } from '../../credentials';

const topicName = 'asynchronous-pull-test';
const subName = 'asynchronous-pull-test';

beforeAll(async () => {
  await createTopic(topicName);
  await createSubscription(topicName, subName);
});

describe('pull#asynchronous-pull', () => {
  const subscription = pubsubClient.topic(topicName).subscription(subName);
  beforeEach(async () => {
    const messagePayload = { name: faker.name.findName(), email: faker.internet.email(), campaignId: '1' };
    await pub(topicName, messagePayload);
  });

  it.skip(
    '#1',
    async () => {
      expect.assertions(2);
      const onMessage = (message: IMessage) => {
        const { data, ...rest } = message;
        const jsonData = parseMessageData(data);
        logger.debug('received message', { arguments: { ...rest, data: jsonData } });
        expect(typeof message.ack).toBe('function');
        expect(typeof (message as any).nack).toBe('function');
        message.ack();
      };

      subscription.on('message', onMessage).on('error', (err: Error) => logger.error(err));

      await sleep(5 * 1000);
      subscription.removeAllListeners();
    },
    10 * 1000
  );

  it.skip(
    'should re-publish the message correctly',
    async () => {
      const onMessage = async (message: IMessage) => {
        const { data, ...rest } = message;
        const jsonData = parseMessageData(data);
        logger.debug('received message', { arguments: { ...rest, data: jsonData } });

        const publishTime = new Date(message.publishTime).getTime();
        const republishTimestamp = Date.now() - 5 * 1000;

        // logger.debug(`message timestamp: ${publishTime}, republishTimestamp: ${republishTimestamp}`);
        if (publishTime < republishTimestamp) {
          logger.info('re-publish message, message acked');
          message.ack();
        } else {
          try {
            const subscriptionPath = subscriberClient.subscriptionPath(credentials.PROJECT_ID, subName);
            const request = {
              subscription: subscriptionPath,
              ackIds: [message.ackId],
              ackDeadlineSeconds: 0
            };
            await subscriberClient.modifyAckDeadline(request);
            logger.info('push message back to MQ');
          } catch (error) {
            logger.error(error);
          }
        }
      };

      subscription.on('message', onMessage).on('error', (err: Error) => logger.error(err));

      await sleep(50 * 1000);
      subscription.removeAllListeners();
    },
    60 * 1000
  );

  it(
    'should re-publish the message correctly with ackDeadlineSeconds',
    async () => {
      const onMessage = async (message: IMessage) => {
        console.count('pull times');
        const { data, ...rest } = message;
        const jsonData = parseMessageData(data);
        logger.debug('received message', { arguments: { ...rest, data: jsonData } });

        const publishTime = new Date(message.publishTime).getTime();
        const republishTimestamp = Date.now() - 5 * 1000;

        if (publishTime < republishTimestamp) {
          logger.info('re-publish message, message acked');
          message.ack();
        } else {
          try {
            // const subscriptionPath = subscriberClient.subscriptionPath(credentials.PROJECT_ID, subName);
            // const request = {
            //   subscription: subscriptionPath,
            //   ackIds: [message.ackId],
            //   ackDeadlineSeconds: 1
            // };
            // await subscriberClient.modifyAckDeadline(request);
            // logger.info('push message back to MQ');
            message.nack();
          } catch (error) {
            logger.error(error);
          }
        }
      };

      subscription.on('message', onMessage).on('error', (err: Error) => logger.error(err));

      await sleep(20 * 1000);
      subscription.removeAllListeners();
    },
    22 * 1000
  );
});
