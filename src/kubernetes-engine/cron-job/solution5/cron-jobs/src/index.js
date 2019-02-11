const { PubSub } = require('@google-cloud/pubsub');

const credentials = require('./credentials');
const config = require('./config');

const pubsub = new PubSub({
  projectId: credentials.PROJECT_ID,
  keyFilename: credentials.KEY_FILE_NAME
});

const topicName = 'daily-report';
const topic = pubsub.topic(topicName);
const publisher = topic.publisher();

const data = Buffer.from(JSON.stringify({ to: config.EMAIL_TO }));

publisher.publish(data, (err, messageId) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Message was published with ID: ', messageId);
});
