import * as PubSub from '@google-cloud/pubsub';
import { Subscription, Topic } from '@google-cloud/pubsub';

import { logger } from '../../utils';

function main() {
  const pubsub: PubSub.PubSub = PubSub();

  pubsub.getSubscriptions((err: Error | null, subscriptions: Subscription[]) => {
    if (err) {
      logger.error(err);
      return;
    }
    const subscriptionNames = subscriptions.map((sub: any) => sub.name);
    logger.info(subscriptionNames);
  });

  pubsub.getTopics((err: Error | null, topics: Topic[]) => {
    if (err) {
      logger.error(err);
      return;
    }

    const topicNames = topics.map((topic: any) => topic.name);
    logger.info(topicNames);
  });
}

main();
