import Pubsub from '@google-cloud/pubsub';
import path from 'path';

import { logger } from '../../utils';
import { init, subName } from './init';

async function main() {
  await init();
  const projectId = 'just-aloe-212502';
  const client = new (Pubsub.v1 as any).SubscriberClient({
    projectId,
    keyFilename: path.resolve(__dirname, '../../../.gcp/just-aloe-212502-4bf05c82cc24.json')
  });

  // logger.info({ label: 'client', message: client });
  const formattedSubscription = client.subscriptionPath(projectId, subName);
  const maxMessages = 1;
  const request = {
    subscription: formattedSubscription,
    maxMessages
  };

  try {
    const responses = await client.pull(request);
    const response = responses[0];
    logger.info({ label: 'response', message: response });
  } catch (error) {
    logger.error(error);
  }
}

main();
