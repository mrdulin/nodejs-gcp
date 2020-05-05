import { PubSub } from '@google-cloud/pubsub';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { PUBSUB_PROJECT_ID, PUBSUB_EMULATOR_HOST } = process.env;
console.log('PUBSUB_EMULATOR_HOST:', PUBSUB_EMULATOR_HOST);
console.log(process.argv);
const pubsub = new PubSub({ projectId: PUBSUB_PROJECT_ID });

async function createSubscription(topicName, subscriptionName) {
  await pubsub.topic(topicName).createSubscription(subscriptionName);
  console.log(`Subscription ${subscriptionName} created.`);
}

async function listenForMessages(subscriptionName, timeout = 60) {
  const subscription = pubsub.subscription(subscriptionName);

  let messageCount = 0;
  const messageHandler = (message) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    message.ack();
  };

  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
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
  case 'receive':
    // npx ts-node ./subscriber.ts receive pubsub-emulator-t1-sub
    subscriptionName = argv[1];
    listenForMessages(subscriptionName);
    break;
}
