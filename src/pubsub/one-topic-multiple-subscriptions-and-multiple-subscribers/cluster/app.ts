import cluster from 'cluster';

import { pubsubClient } from '../../../googlePubsub';
import { logger } from '../../../utils';
import { init, SUB_A } from './init';

async function main() {
  if (cluster.isWorker) {
    process.on('message', (msg) => {
      logger.info(`'Worker ' + process.pid + ' received message from master.' ${msg}`);
    });
  }
  // pubsubClient.subscription(SUB_A).on('message', (message) => {
  //   logger.info(`receieve message from sub:${SUB_A}. message: ${JSON.stringify(message)}`);
  //   // message.ack();
  // });
}

main();
