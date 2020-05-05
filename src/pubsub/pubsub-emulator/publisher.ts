import { PubSub } from '@google-cloud/pubsub';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { PUBSUB_PROJECT_ID, PUBSUB_EMULATOR_HOST } = process.env;
console.log('PUBSUB_EMULATOR_HOST:', PUBSUB_EMULATOR_HOST);
console.log(process.argv);

async function createTopic(topicName) {
  const pubsub = new PubSub({ projectId: PUBSUB_PROJECT_ID });
  const [topic] = await pubsub.createTopic(topicName);
  console.log(`Topic ${topicName} created.`);
  return topic;
}

async function publishMessage(topicName) {
  const pubsub = new PubSub({ projectId: PUBSUB_PROJECT_ID });
  const data = JSON.stringify({ foo: 'bar' });
  const dataBuffer = Buffer.from(data);

  const messageId = await pubsub.topic(topicName).publish(dataBuffer);
  console.log(`Message ${messageId} published.`);
}

const argv = process.argv.slice(2);
const topicName = argv[1];
const command = argv[0];

switch (command) {
  case 'create':
    createTopic(topicName);
    break;
  case 'publish':
    // npx ts-node ./publisher.ts publish pubsub-emulator-t1
    publishMessage(topicName);
    break;
}
