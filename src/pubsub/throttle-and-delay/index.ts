import faker from 'faker';
import EventEmitter from 'events';
import _ from 'lodash';
import { PubSub } from '@google-cloud/pubsub';

import '../../envVars';
import { pub as publish, createTopic, createSubscription, pubsubClient, subscriberClient } from '../../googlePubsub';
import { logger, sleep } from '../../utils';

const eventEmitter = new EventEmitter();
const createUserEvent = 'createUser';

export const TOPIC = 'throttle-and-delay';
export const SUB = TOPIC;

async function init() {
  await createTopic(TOPIC);
  await createSubscription(TOPIC, SUB);
}

async function sub() {
  await init();
  logger.info(`projectId: ${process.env.PROJECT_ID}`);

  // JUST FOR TESTING, DO NOT USE
  // delayTesting();
  // throttleTesting();

  delayTestingV2();

  mockCreateUserCloudFunction();
}

async function pub() {
  await init();

  for (let i = 0; i < 3; i++) {
    const message = { name: faker.name.findName() };
    publish(TOPIC, message);
  }
}

function delayTestingV2() {
  const options: PubSub.SubscriptionOptions = {
    flowControl: {
      maxMessages: 1
    }
  };
  const ackIds: string[] = [];
  pubsubClient.subscription(SUB, options).on('message', async (message) => {
    logger.info(`subscriber A receieve message from sub:${SUB}.`);

    const jsonString = Buffer.from(message.data, 'base64').toString();
    const user = JSON.parse(jsonString);

    // ackIds.push(message.ackId);
    // console.log('ackIds: ', ackIds);
    // const request = {
    //   subscription: subscriberClient.subscriptionPath(process.env.PROJECT_ID, SUB),
    //   ackIds: [message.ackId],
    //   ackDeadlineSeconds: 10
    // };
    // try {
    //   await subscriberClient.modifyAckDeadline(request);
    // } catch (error) {
    //   logger.error(error);
    // }

    const verbose = true;
    // await sleep(2 * 1000, verbose);
    await sleep(5 * 1000, verbose);
    message.ack();
    tirggerCreateUserCloudFunction(user);
  });
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

export { sub, pub };
