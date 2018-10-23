const Pubsub = require('@google-cloud/pubsub');
const moment = require('moment');

const pubsub = new Pubsub();
const topic = 'retry';
const deadletter = 'deadletter';
const MAX_RETRY = 4;
const RETRY_WAIT = 15 * 1000;

function publisher(topic) {
  return pubsub.topic(topic).publisher();
}

const coin = () => Math.random() > 0.5;
const genRandomErrorMessage = () => `err msg - ${Math.random()}`;
const toBufferMessage = msg => Buffer.from(JSON.stringify(msg));
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

exports.retryFunction = (event, callback) => {
  const pubsubMessage = event.data;
  const data = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('data: ', data);
  console.log('data.retryTimes: ', data.retryTimes, typeof data.retryTimes);

  const exceptionHappen = coin();
  let timer;
  if (exceptionHappen) {
    console.log('exception happened');
    data.retryTimes = Number.parseInt(data.retryTimes, 10);
    if (typeof data.retryTimes === 'number' && data.retryTimes < MAX_RETRY) {
      data.retryTimes += 1;
      console.log(`Retry will start in ${readableTime(RETRY_WAIT)} seconds`);
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
    } else {
      console.error('Bussiness failed and retry times is out.');
      timer && clearTimeout(timer);

      console.info(`Start to publish message to topic:${deadletter}.`);
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
    timer && clearTimeout(timer);
    callback();
  }
};
