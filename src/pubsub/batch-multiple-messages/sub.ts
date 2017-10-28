import { logger } from '../../utils';
import { createSubscription, pubsubClient } from '../../googlePubsub';
import { topicName, subName } from './constants';

async function main() {
  await createSubscription(topicName, subName);
  pubsubClient.subscription(subName).on('message', (message) => {
    const { id, attributes } = message;
    const jsonData = JSON.parse(message.data.toString());
    logger.debug('message', { arguments: { message: { id, attributes, data: jsonData } } });
    message.ack();
  });
}

main();
