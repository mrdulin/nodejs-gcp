import { PubSub } from '@google-cloud/pubsub';
import { SUB, init } from './init';
import { pubsubClient, subscriberClient } from '../../googlePubsub';
import { logger } from '../../utils';

async function main() {
  await init();
  const options: PubSub.SubscriptionOptions = {
    flowControl: {
      // maxMessages: 3
    }
  };
  pubsubClient.subscription(SUB, options).on('message', (message) => {
    logger.info(`subscriber A receieve message from sub:${SUB}. message: ${JSON.stringify(message)}`);
    // message.ack();
    // message.nack();
  });

  // setTimeout(() => {
  //   console.log('subscriber B start to subscribe message');
  //   pubsubClient.subscription(SUB, options).on('message', (message) => {
  //     logger.info(`subscriber B receieve message from sub:${SUB}. message: ${JSON.stringify(message)}`);
  //     // message.ack();
  //   });
  // }, 2000);

  setTimeout(() => {
    console.log('subscriber C start to subscribe message');
    pubsubClient.subscription(SUB, options).on('message', (message) => {
      logger.info(`subscriber C receieve message from sub:${SUB}. message: ${JSON.stringify(message)}`);
      // message.ack();
    });
  }, 12 * 1000);
}

main();
