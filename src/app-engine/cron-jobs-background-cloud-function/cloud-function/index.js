const { pub, createEmailRetryTopicName, deadletterTopicName } = require('./pubsub');

const coin = () => Math.random() > 0.5;
const MAX_RETRY = process.env.MAX_RETRY || 5;

function cronJobsBackgroundFunction(event, callback) {
  const pubsubMessage = event.data;
  const data = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('data: ', data);

  const errorHappened = 1 || coin();
  if (errorHappened) {
    const errMsg = 'error happened';
    console.error(errMsg);
    const maxRetry = data.maxRetry || MAX_RETRY;
    if (data.retryTimes === maxRetry) {
      pub(deadletterTopicName, { msg: data, error: errMsg }, callback);
    } else {
      pub(createEmailRetryTopicName, data, callback);
    }
  } else {
    console.log('business success');
    callback();
  }
}

exports.cronJobsBackgroundFunction = cronJobsBackgroundFunction;
