import faker from 'faker';
import { pubsubClient, createTopic, createSubscription, pub } from '../../googlePubsub';
import { logger, sleep } from '../../utils';
import { Subscription } from '@google-cloud/pubsub';

const topicName = 'one-topic-one-subscription-and-multiple-subscribers';
const subName = 'one-topic-one-subscription-and-multiple-subscribers';
beforeAll(async () => {
  await createTopic(topicName);
  await createSubscription(topicName, subName);
});

describe('one-topic-one-subscription-and-multiple-subscribers', () => {
  // beforeEach(async () => {
  //   const tasks: any[] = [];
  //   const publishedMessageCount = 5;
  //   for (let i = 0; i < publishedMessageCount; i++) {
  //     const message = { email: faker.internet.email(), index: i };
  //     tasks.push(pub(topicName, message));
  //   }
  //   await Promise.all(tasks);
  // });

  it(
    '竞争关系，消息被随机分配给不同的消费者',
    async () => {
      const publishedMessageCount = 5;
      let receivedMessageCount = 0;
      const subscribers: string[] = ['A', 'B', 'C'];
      const subscriptions: Subscription[] = [];

      for (const subscriber of subscribers) {
        const subscription: Subscription = pubsubClient.subscription(subName);
        subscriptions.push(subscription);
        subscription.on('message', (message) => {
          logger.info(`subscriber ${subscriber} receieve message`);
          receivedMessageCount += 1;
          message.ack();
        });
      }

      let currentPublishedMessageCount = 0;
      const timer = setInterval(async () => {
        if (currentPublishedMessageCount >= publishedMessageCount) {
          clearInterval(timer);

          expect(receivedMessageCount).toBe(publishedMessageCount);
          expect(subscriptions).toHaveLength(subscribers.length);
          subscriptions.forEach((subscription: Subscription) => {
            subscription.removeAllListeners();
          });
        } else {
          const message = { email: faker.internet.email(), index: currentPublishedMessageCount };
          await pub(topicName, message);
          currentPublishedMessageCount += 1;
        }
      }, 1000);
    },
    15 * 1000
  );
});
