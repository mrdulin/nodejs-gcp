const { dailyReport } = require('./dailyReport');
const { pubsub } = require('./pubsub');

(async function listenToMessage() {
  const topicName = 'daily-report';
  const subName = 'daily-report';
  const subscription = pubsub.topic(topicName).subscription(subName);

  subscription.on('message', onMessage);
  subscription.on('error', (err) => {
    console.error(err);
  });
})();

function onMessage(message) {
  const dataString = Buffer.from(message.data).toString();
  try {
    const message = JSON.parse(dataString);
    console.log(message);
    dailyReport(message);
  } catch (error) {
    console.error(error);
  } finally {
    console.log('message acked');
    message.ack();
  }
}
