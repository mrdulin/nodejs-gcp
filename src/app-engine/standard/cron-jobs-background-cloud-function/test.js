const { pub } = require('./pubsub');
const request = require('request-promise');

const topic = 'createEmail';
const retryTopic = 'createEmailRetry';

async function main() {
  const data = { name: 'test' };
  await pub(retryTopic, data);
  await triggerCronJob();
}

async function triggerCronJob() {
  const url = `http://localhost:8080/cron/events/${topic}/${retryTopic}`;
  try {
    const res = await request(url);
    console.log('trigger cron job success.', res);
  } catch (error) {
    console.error('trigger cron job failed.', error);
  }
}

main();
