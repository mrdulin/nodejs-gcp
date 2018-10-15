const Pubsub = require('@google-cloud/pubsub');

const pubsub = new Pubsub();
const topic = 'retry';
const deadletter = 'deadletter';

function publisher(topic) {
  return pubsub.topic(topic).publisher();
}

const coin = () => Math.random() > 0.5;
const genRandomErrorMessage = () => `err msg - ${Math.random()}`;
const toBufferMessage = msg => Buffer.from(JSON.stringify(msg));

exports.retryFunction = (event, callback) => {
  const pubsubMessage = event.data;
  const data = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('data: ', data);
  console.log('data.retryTimes: ', data.retryTimes, typeof data.retryTimes);

  const exceptionHappen = coin();
  if (exceptionHappen) {
    data.retryTimes = Number.parseInt(data.retryTimes, 10);
    if (typeof data.retryTimes === 'number' && data.retryTimes < 4) {
      data.retryTimes += 1;
      publisher(topic)
        .publish(toBufferMessage(data))
        .then(_ => {
          console.log('Publisher retry publish successfully');
          callback();
        })
        .catch(err => {
          console.error('Publisher retry publish error:', err);
          callback(err);
        });
    } else {
      console.error('Bussiness failed and retry times is out');
      publisher(deadletter)
        .publish(toBufferMessage({ errMsg: genRandomErrorMessage() }))
        .then(() => {
          console.log(`Publish message to ${deadletter} topic successfully`);
          callback();
        })
        .catch(_ => {
          console.error(`Publish message to ${deadletter} topic failed: `, err);
          callback();
        });
    }
  } else {
    console.log('Bussiness success');
    callback();
  }
};
