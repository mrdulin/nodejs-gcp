import { PubSub, Subscription } from '@google-cloud/pubsub';
import { SUB, init } from './init';
import { pubsubClient, subscriberClient } from '../../googlePubsub';
import { logger, sleep, coin } from '../../utils';
import '../../envVars';

const defaultAckDeadline = 10 * 1000;
const subscription: Subscription = pubsubClient.subscription(SUB);

async function main() {
  await init();
  subscription.on('message', messageHandler);
}

async function messageHandler(message) {
  logger.info(`subscriber A receieve message from sub:${SUB}.`);
  const jsonString = Buffer.from(message.data, 'base64').toString();
  logger.info(`data: ${jsonString}`);

  const ackIds: string[] = [message.ackId];
  const ackDeadlineSeconds = 2;
  const request = {
    subscription: `projects/${process.env.PROJECT_ID}/subscriptions/${SUB}`,
    ackIds,
    ackDeadlineSeconds
  };

  logger.info(`request: ${JSON.stringify(request)}`);

  try {
    // pubsub still deliver message every 10s
    await subscriberClient.modifyAckDeadline(request);
  } catch (error) {
    logger.error(error);
  }
  subscription.removeListener('message', messageHandler);
  const verbose = true;
  await sleep(ackDeadlineSeconds * 1000 + 1000, verbose);
  main();
}

main();
