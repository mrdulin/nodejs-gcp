import { PubSub } from '@google-cloud/pubsub';
import dotenv from 'dotenv';
import path from 'path';

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
      maxMessages: 2000,
      maxMilliseconds: 1000,
    },
  });

  // let idx = 0;
  // setInterval(() => {
  //   const data = `message payload ${idx}`;
  //   const dataBuffer = Buffer.from(data);
  //   topic.publish(dataBuffer);
  //   idx++;
  // }, 1000);

  const n = 50 * 1000;
  const dataBufs: Buffer[] = [];
  for (let i = 0; i < n; i++) {
    const data = `message payload ${i}`;
    const dataBuffer = Buffer.from(data);
    dataBufs.push(dataBuffer);
  }

  const tasks = dataBufs.map(async (message, idx) => {
    try {
      const messageId = await topic.publish(message);
      console.log(`[${new Date().toISOString()}] Message ${messageId} published. index: ${idx}`);
      return messageId;
    } catch (error) {
      console.error(error);
    }
  });

  await Promise.all(tasks);
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
