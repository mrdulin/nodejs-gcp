import EventEmitter from 'events';
import _ from 'lodash';

import { SUB, init } from './init';
import { pubsubClient } from '../../googlePubsub';
import { logger } from '../../utils';

const eventEmitter = new EventEmitter();
const createUserEvent = 'createUser';

async function main() {
  await init();

  // JUST FOR TESTING, DO NOT USE
  // delayTesting();
  throttleTesting();

  mockCreateUserCloudFunction();
}

function delayTesting() {
  pubsubClient.subscription(SUB).on('message', (message) => {
    logger.info(`subscriber A receieve message from sub:${SUB}.`);
    message.ack();

    const jsonString = Buffer.from(message.data, 'base64').toString();
    const user = JSON.parse(jsonString);
    _.delay(tirggerCreateUserCloudFunction, 5000, user);
  });
}

function throttleTesting() {
  function messageHandler(message) {
    logger.info(`subscriber A receieve message from sub:${SUB}.`);
    message.ack();

    const jsonString = Buffer.from(message.data, 'base64').toString();
    const user = JSON.parse(jsonString);

    tirggerCreateUserCloudFunction(user);
  }
  const throttleMessageHandler = _.throttle(messageHandler, 5000);
  pubsubClient.subscription(SUB).on('message', throttleMessageHandler);
}

function tirggerCreateUserCloudFunction(data) {
  eventEmitter.emit(createUserEvent, data);
}

function mockCreateUserCloudFunction() {
  eventEmitter.on(createUserEvent, (user) => {
    console.log('user: ', user);
  });
}

main();
