import { PubSub } from '@google-cloud/pubsub';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { PUBSUB_PROJECT_ID, PUBSUB_EMULATOR_HOST } = process.env;
console.log('PUBSUB_EMULATOR_HOST:', PUBSUB_EMULATOR_HOST);

async function createTopic(topicName) {
  const pubsub = new PubSub({ projectId: PUBSUB_PROJECT_ID });
  const [topic] = await pubsub.createTopic(topicName);
  console.log(`Topic ${topicName} created.`);
  return topic;
}

/**
 * batching explanation:
 * 1. 如果待发布的消息达到了maxMessages指定的数量，则立即批量发布与maxMessages数量相等的消息;
 * 2. 如果待发布的消息没有达到maxMessages指定的数量，则等待maxMilliseconds时间后，批量发送这些消息
 * @param topicName
 */
async function publishMessage(topicName) {
  console.log(`[${new Date().toISOString()}] publishing messages`);
  const pubsub = new PubSub({ projectId: PUBSUB_PROJECT_ID });
  const topic = pubsub.topic(topicName, {
    batching: {
      maxMessages: 10,
      maxMilliseconds: 10 * 1000,
    },
  });

  const n = 12;
  const dataBufs: Buffer[] = [];
  for (let i = 0; i < n; i++) {
    const data = `message payload ${i}`;
    const dataBuffer = Buffer.from(data);
    dataBufs.push(dataBuffer);
  }

  const results = await Promise.all(
    dataBufs.map((dataBuf, idx) =>
      topic.publish(dataBuf).then((messageId) => {
        console.log(`[${new Date().toISOString()}] Message ${messageId} published. index: ${idx}`);
        return messageId;
      })
    )
  );
  console.log('results:', results.toString());
}

// const tasks = dataBufs.map(async (message) => {
//   try {
//     const messageId = await topic.publish(message);
//     console.log(`[${new Date().toISOString()}] Message ${messageId} published.`);
//     return messageId;
//   } catch (error) {
//     console.error(error);
//   }
// });
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

setImmediate;
