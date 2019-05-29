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
  it.skip(
    '#1',
    async () => {
      expect.assertions(2);
      const subscription = pubsubClient.topic(topicName).subscription(subName);
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
    'should ack the messages correctly with call message.nack() after specific duration',
    async () => {
      const publishedMessageCount = 10;
      let ackedMessageCount = 0;
      const subscription = pubsubClient.topic(topicName).subscription(subName);
      const onMessage = async (message: IMessage) => {
        const { data, ...rest } = message;
        const jsonData = parseMessageData(data);
        // logger.debug('received message', { arguments: { ...rest, data: jsonData } });

        const publishTime = new Date(message.publishTime).getTime();
        const republishTimestamp = Date.now() - 5 * 1000;

        if (publishTime < republishTimestamp) {
          logger.info(`message: ${jsonData.index} acked`);
          ackedMessageCount += 1;
          message.ack();
        } else {
          const duration = Math.abs(republishTimestamp - publishTime);
          logger.info(
            `push message ${jsonData.index} back to MQ, after ${duration /
              1000} seconds, this message will be redelivered`
          );
          await sleep(duration);
          message.nack();
        }
      };

      subscription.on('message', onMessage).on('error', (err: Error) => logger.error(err));

      const tasks: any[] = [];
      for (let i = 0; i < publishedMessageCount; i++) {
        const messagePayload = { email: faker.internet.email(), index: i };
        tasks.push(pub(topicName, messagePayload));
      }
      await Promise.all(tasks);

      await sleep(20 * 1000);
      expect(ackedMessageCount).toBe(publishedMessageCount);
      subscription.removeAllListeners();
    },
    21 * 1000
  );

  it(
    '#3',
    async () => {
      let ackedMessageCount = 0;
      const subscription = pubsubClient.topic(topicName).subscription(subName);
      const onMessage = async (message: IMessage) => {
        const { data, ...rest } = message;
        const jsonData = parseMessageData(data);
        const publishTime = new Date(message.publishTime).getTime();
        const republishTimestamp = Date.now() - 30 * 1000;

        if (publishTime < republishTimestamp) {
          logger.info(
            `message: ${jsonData.index} acked. publishTime: ${new Date(
              message.publishTime
            ).toLocaleTimeString()}, now: ${new Date().toLocaleTimeString()}`
          );
          ackedMessageCount += 1;
          message.ack();
        } else {
          const duration = Math.abs(republishTimestamp - publishTime);
          logger.info(
            `push message ${jsonData.index} back to MQ, after ${duration /
              1000} seconds, this message will be redelivered`
          );
          await sleep(duration);
          message.nack();
        }
      };
      subscription.on('message', onMessage).on('error', (err: Error) => logger.error(err));

      const publishedMessageCount = 10;
      let currentPublishedMessageCount = 0;
      const timer = setInterval(async () => {
        if (currentPublishedMessageCount >= publishedMessageCount) {
          clearInterval(timer);
        } else {
          const messagePayload = { email: faker.internet.email(), index: currentPublishedMessageCount };
          currentPublishedMessageCount += 1;
          await pub(topicName, messagePayload);
        }
      }, 3 * 1000);

      await sleep(120 * 1000);
      expect(ackedMessageCount).toBe(publishedMessageCount);
      subscription.removeAllListeners();
    },
    121 * 1000
  );

  it.skip(
    'should publish the message correctly',
    async () => {
      const subscription = pubsubClient.topic(topicName).subscription(subName);
      const onMessage = async (message: IMessage) => {
        const { data, ...rest } = message;
        const jsonData = parseMessageData(data);
        logger.debug('received message', { arguments: { ...rest, data: jsonData } });

        const publishTime = new Date(message.publishTime).getTime();
        const republishTimestamp = Date.now() - 5 * 1000;

        // logger.debug(`message timestamp: ${publishTime}, republishTimestamp: ${republishTimestamp}`);
        if (publishTime < republishTimestamp) {
          logger.info('message acked');
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

  it.skip(
    // tslint:disable-next-line:max-line-length
    'should publish the message correctly when call nack. message.nack() => pubsub re-deliver message => message handler',
    async () => {
      const subscription = pubsubClient.topic(topicName).subscription(subName);
      const onMessage = async (message: IMessage) => {
        console.count('pull times');
        const { data, ...rest } = message;
        const jsonData = parseMessageData(data);
        logger.debug('received message', { arguments: { ...rest, data: jsonData } });

        const publishTime = new Date(message.publishTime).getTime();
        const republishTimestamp = Date.now() - 5 * 1000;

        if (publishTime < republishTimestamp) {
          logger.info('message acked');
          message.ack();
        } else {
          try {
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

  describe.skip('#flowControl', () => {
    beforeEach(async () => {
      const tasks: any[] = [];
      for (let i = 0; i < 5; i++) {
        const messagePayload = { name: faker.name.findName(), email: faker.internet.email(), index: i };
        tasks.push(pub(topicName, messagePayload));
      }
      await Promise.all(tasks);
    });
    it(
      '#maxMessages - should pull messages with specific count every 1 second',
      async () => {
        const subscription = pubsubClient.topic(topicName).subscription(subName, {
          flowControl: {
            // 可以简单理解为一秒拉取5条消息进行处理
            maxMessages: 5
            // 一秒拉取1条消息进行处理
            // maxMessages: 1
          }
        });
        const onMessage = async (message: IMessage) => {
          console.count('pull times');
          const { data, ...rest } = message;
          const jsonData = parseMessageData(data);
          logger.debug(`received message with index: ${jsonData.index}`);

          const publishTime = new Date(message.publishTime).getTime();
          const republishTimestamp = Date.now() - 5 * 1000;

          if (publishTime < republishTimestamp) {
            logger.info('re-publish message, message acked');
            message.ack();
          } else {
            try {
              message.nack();
            } catch (error) {
              logger.error(error);
            }
          }
        };

        subscription.on('message', onMessage).on('error', (err: Error) => logger.error(err));

        await sleep(10 * 1000);
        subscription.removeAllListeners();
      },
      11 * 1000
    );
  });
});
