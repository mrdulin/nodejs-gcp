const Pubsub = require('@google-cloud/pubsub');

const pubsubClient = new Pubsub();

const createEmailRetryTopicName = 'createEmailRetry';
const deadletterTopicName = 'deadletter';

function pub(topicName, message, callback) {
  const dataBuf = Buffer.from(JSON.stringify(message));
  return pubsubClient
    .topic(topicName)
    .publisher()
    .publish(dataBuf)
    .then(() => {
      console.log(`publish message to topic:${topicName} success.`);
    })
    .catch(err => {
      console.error(`publish message to topic:${topicName} failed.`, err);
    })
    .then(() => {
      console.log('finally');
      callback && callback();
    });
}

module.exports = { pub, pubsubClient, createEmailRetryTopicName, deadletterTopicName };
