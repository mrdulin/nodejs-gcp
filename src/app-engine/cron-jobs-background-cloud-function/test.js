const { pub, createEmailRetryTopicName } = require('./pubsub');
const request = require('request-promise');

async function main() {
  const data = { name: 'test' };
  await pub(createEmailRetryTopicName, data);
  await triggerCronJob();
}

async function triggerCronJob() {
  const url = 'http://localhost:8080/cron/events/createEmailRetry';
  try {
    const res = await request(url);
    console.log('trigger cron job success.', res);
  } catch (error) {
    console.error('trigger cron job failed.', error);
  }
}

main();
