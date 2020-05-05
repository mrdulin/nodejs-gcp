import { PubSub } from '@google-cloud/pubsub';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { PUBSUB_PROJECT_ID, PUBSUB_EMULATOR_HOST } = process.env;
console.log('PUBSUB_EMULATOR_HOST:', PUBSUB_EMULATOR_HOST);
const pubsub = new PubSub({ projectId: PUBSUB_PROJECT_ID });

async function createSubscription(topicName, subscriptionName) {
  await pubsub.topic(topicName).createSubscription(subscriptionName);
  console.log(`Subscription ${subscriptionName} created.`);
}

async function deleteSubscription(subscriptionName) {
  await pubsub.subscription(subscriptionName).delete();
  console.log(`Subscription ${subscriptionName} deleted.`);
}

async function listenForMessages(subscriptionName, timeout = 60) {
  console.log('listen for the messages...');
  const subscription = pubsub.subscription(subscriptionName);

  let messageCount = 0;
  const messageHandler = (message) => {
    console.log(`[${new Date().toISOString()}]Received message ${message.id}:`);
    console.log(`Data: ${message.data}`);
    console.log(`Attributes: ${JSON.stringify(message.attributes)}`);
    messageCount += 1;

    message.ack();
  };

  const errorHandler = function (error) {
    console.error(`ERROR: ${error}`);
  };

  subscription.on('message', messageHandler);
  subscription.on('error', errorHandler);

  // setTimeout(() => {
  //   subscription.removeListener('message', messageHandler);
  //   subscription.removeListener('error', errorHandler);
  //   console.log(`${messageCount} message(s) received.`);
  // }, timeout * 1000);
}

const argv = process.argv.slice(2);
const command = argv[0];
let subscriptionName;
switch (command) {
  case 'create':
    const topicName = argv[1];
    subscriptionName = argv[2];
    createSubscription(topicName, subscriptionName);
    break;
  case 'delete':
    subscriptionName = argv[1];
    deleteSubscription(subscriptionName);
    break;
  case 'receive':
    // npx ts-node ./subscriber.ts receive pubsub-emulator-t1-sub
    subscriptionName = argv[1];
    listenForMessages(subscriptionName);
    break;
}
