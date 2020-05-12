import { PubSub } from '@google-cloud/pubsub';
import dotenv from 'dotenv';
import path from 'path';
import bluebird from 'bluebird';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { PUBSUB_PROJECT_ID } = process.env;

async function createTopic(topicName) {
  const pubsub = new PubSub({ projectId: PUBSUB_PROJECT_ID });
  const [topic] = await pubsub.createTopic(topicName);
  console.log(`Topic ${topicName} created.`);
  return topic;
}

async function publishMessage(topicName) {
  console.log(`[${new Date().toISOString()}] publishing messages`);
  const pubsub = new PubSub({ projectId: PUBSUB_PROJECT_ID });
  const topic = pubsub.topic(topicName, {
    batching: {
      maxMessages: 1000,
      maxMilliseconds: 100,
    },
  });

  const n = 50 * 1000;
  const dataBufs: Buffer[] = [];
  for (let i = 0; i < n; i++) {
    const data = `message payload ${i}`;
    const dataBuffer = Buffer.from(data);
    dataBufs.push(dataBuffer);
  }

  await bluebird
    .map(dataBufs, (d) => topic.publish(d), { concurrency: 1000 })
    .then((messageIds) => {
      console.log(`[${new Date().toISOString()}] Message ${messageIds} published.`);
    });
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
