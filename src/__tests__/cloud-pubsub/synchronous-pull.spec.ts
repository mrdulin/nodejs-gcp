import faker from 'faker';
import { createSubscription, createTopic, pullMessages, pub, subscriberClient } from '../../googlePubsub';
import { logger } from '../../utils';
import { credentials } from '../../credentials';

const topicName = 'pull-messages';
const subName = 'pull-messages';

beforeAll(async () => {
  await createTopic(topicName);
  await createSubscription(topicName, subName);
});

describe('pull#synchronous_pull', () => {
  let ackIds: string[] = [];
  // beforeEach(async () => {});
  afterEach(() => {
    ackIds = [];
  });

  it('should pull the message correctly', async () => {
    await pub(topicName, { email: faker.internet.email() });

    const messagesJSONString = await pullMessages(subName, 1);
    const messages = JSON.parse(messagesJSONString);
    const message = messages[0];
    logger.debug('message and messages', { extra: { message, messages } });

    expect(message.ack).toBeUndefined();
    expect(typeof message.ackId).toBe('string');
    const subscriptionPath = subscriberClient.subscriptionPath(credentials.PROJECT_ID, subName);
    ackIds.push(message.ackId);
    const request = { subscription: subscriptionPath, ackIds };
    await subscriberClient.acknowledge(request);
    logger.info('message acknowledged');
  });
});
