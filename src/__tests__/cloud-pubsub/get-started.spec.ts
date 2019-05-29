import PubSub, { Subscription, Topic } from '@google-cloud/pubsub';
import { logger } from '../../utils';

describe('get started', () => {
  const pubsub: PubSub.PubSub = PubSub();

  it('should get the subscriptions correctly', async () => {
    const subscriptions: Subscription[] = await pubsub.getSubscriptions();
    const subscriptionNames = subscriptions.map((sub: any) => sub.name);
    logger.debug('subscriptionNames', { extra: { subscriptionNames } });
  });

  it('should get the topics correctly', async () => {
    const topics: Topic[] = await pubsub.getTopics();
    const topicNames = topics.map((topic: any) => topic.name);
    logger.debug('topicNames', { extra: { topicNames } });
  });
});
