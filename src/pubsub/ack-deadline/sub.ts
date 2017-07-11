import { PubSub, Subscription } from '@google-cloud/pubsub';
import { SUB, init } from './init';
import { pubsubClient, subscriberClient } from '../../googlePubsub';
import { logger, sleep, coin } from '../../utils';

const defaultAckDeadline = 10 * 1000;
const subscription: Subscription = pubsubClient.subscription(SUB);

async function main() {
  await init();
  subscription.on('message', messageHandler);
}

/**
 * 1. coinResult: true => message.nack() => pubsub re-deliver message => messageHandler
 * 2. coinResult: false => after 11 seconds(The message is put back to pubsub, pubsub will re-deliver it)
 *    => re-run main function and add a new listener for message event. => messageHandler
 *
 * @author dulin
 * @param {*} message
 * @returns
 */
async function messageHandler(message) {
  logger.info(`subscriber A receieve message from sub:${SUB}.`);
  const jsonString = Buffer.from(message.data, 'base64').toString();
  logger.info(`data: ${jsonString}`);
  // message.ack();

  const coinResult = coin();
  logger.info(`coinResult: ${coinResult}`);
  if (coinResult) {
    message.nack();
    return;
  }
  subscription.removeListener('message', messageHandler);
  const verbose = true;
  await sleep(defaultAckDeadline + 1000, verbose);
  main();
}

main();
