const { pubsubClient, parseMessage } = require('./pubsub');

const { sendEmail } = require('./email');
const constants = require('./constants');

function listenDailyReportMessage() {
  console.log(`Worker-${process.pid} listens daily report message`);
  const { subscriptionName } = constants;
  const subscription = pubsubClient.subscription(subscriptionName);

  subscription.on('message', dailyReport);
  subscription.on('error', (error) => {
    console.error(`Worker-${process.pid} listens daily report message failed`);
    console.error(error);
  });
}

function dailyReport(message) {
  console.log(`Worker-${process.pid} received message: ${message.id}`);
  const data = parseMessage(message.data);
  sendEmail(data);
  message.ack();
}

module.exports = {
  listenDailyReportMessage
};
