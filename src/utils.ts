import { createLogger } from 'dl-toolkits';
import crypto from 'crypto';
import _ from 'lodash';

const logger = createLogger({ serviceName: 'nodejs-gcp' });

function sleep(ms: number, verbose?: boolean): Promise<void> {
  if (verbose) {
    const unit = 1000;
    logger.info(`start the timer...${ms / unit}s`);
    const intervalId = setInterval(() => {
      ms -= unit;
      if (ms > 0) {
        logger.info(`${ms / unit}s`);
      } else {
        logger.info('timer end');
        clearInterval(intervalId);
      }
    }, unit);
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function coin(): boolean {
  return Math.random() > 0.5;
}

function genBufferMessage(message: object | string): Buffer {
  let jsonString;
  if (typeof message === 'string') {
    jsonString = message;
  } else if (_.isPlainObject(message)) {
    jsonString = JSON.stringify(message);
  } else {
    throw new TypeError('Wrong message data type');
  }
  // logger.info(`Random data: ${jsonString}`);
  const dataBuffer = Buffer.from(jsonString);
  return dataBuffer;
}

function parsePubsubEventData(event, verbose: boolean = true) {
  const pubsubMessage = event.data;
  if (verbose) {
    console.log('pubsubMessage: ', pubsubMessage);
  }
  const message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  if (verbose) {
    console.log('message:', message);
  }
  return message;
}

function generateEncryptionKey() {
  const buffer = crypto.randomBytes(32);
  return buffer.toString('base64');
}

export { logger, sleep, coin, genBufferMessage, parsePubsubEventData, generateEncryptionKey };
