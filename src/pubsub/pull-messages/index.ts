import { Subscription } from '@google-cloud/pubsub';

import { pubsubClient, createSubscription } from '../../googlePubsub';
import { logger } from '../../utils';

async function main() {
  const topicName = 'deadletter';
  const subscriptionName = 'deadletter-sub';
  await createSubscription(topicName, subscriptionName);
  const subscription: Subscription = pubsubClient.subscription(subscriptionName);
  logger.info('Start to pull deadletter messages');
  subscription.on('message', message => {
    logger.info({
      label: 'message',
      message: {
        id: message.id,
        data: message.data.toString(),
        attributes: message.attributes
      }
    });
  });
}

main();
