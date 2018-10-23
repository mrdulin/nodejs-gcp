const Pubsub = require('@google-cloud/pubsub');
const moment = require('moment');

const pubsub = new Pubsub();
const RETRY_TOPIC = 'retry';
const DEADLETTER_TOPIC = 'deadletter';
const MAX_RETRY = 4;
const RETRY_WAIT = 10 * 1000;

function publisher(topic) {
  return pubsub.topic(topic).publisher();
}

const coin = () => Math.random() > 0.5;
const genRandomErrorMessage = () => `err msg - ${Math.random()}`;
const toBufferMessage = msg => Buffer.from(JSON.stringify(msg));
const parsePubsubEventData = data => JSON.parse(Buffer.from(data, 'base64').toString());
const readableTime = mills => {
  const duration = moment.duration(mills);
  const h = duration.hours();
  const m = duration.minutes();
  const s = duration.seconds();
  let time = '';
  time += h ? h + 'hours' : '';
  time += m ? m + 'mins' : '';
  time += s ? s + 'secs' : '';
  return time;
};

function retry(opts, callback) {
  const { data, topic } = opts;
  let timer;
  data.retryTimes = Number.parseInt(data.retryTimes, 10);
  if (typeof data.retryTimes === 'number' && data.retryTimes < MAX_RETRY) {
    data.retryTimes += 1;
    console.log(`Retry will start in ${readableTime(RETRY_WAIT)}`);
    timer = setTimeout(() => {
      console.log('Start to retry...');
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
    }, RETRY_WAIT);
    return timer;
  } else {
    console.error('Bussiness failed and retry times is out.');
    stopRetry(timer);
    publishToDLQ(callback);
  }
}

function stopRetry(timer) {
  timer && clearTimeout(timer);
}

function publishToDLQ(callback) {
  console.info(`Start to publish message to topic:${DEADLETTER_TOPIC}.`);
  publisher(DEADLETTER_TOPIC)
    .publish(toBufferMessage({ errMsg: genRandomErrorMessage() }))
    .then(() => {
      console.log(`Publish message to ${DEADLETTER_TOPIC} topic successfully`);
      callback();
    })
    .catch(_ => {
      console.error(`Publish message to ${DEADLETTER_TOPIC} topic failed: `, err);
      callback();
    });
}

exports.retryFunction = (event, callback) => {
  const pubsubMessage = event.data;
  const data = parsePubsubEventData(pubsubMessage.data);
  console.log('data: ', data);
  console.log('data.retryTimes: ', data.retryTimes, typeof data.retryTimes);

  // simulate exception
  const exceptionHappen = coin();
  let retryId;
  if (exceptionHappen) {
    console.log('exception happened');
    retryId = retry({ data, topic: RETRY_TOPIC }, callback);
  } else {
    console.log('Bussiness success');
    stopRetry(retryId);
    callback();
  }
};
