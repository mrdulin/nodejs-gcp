const PubSub = require('@google-cloud/pubsub');
const { config } = require('./config');

const pubsubClient = new PubSub();
const options = {};
const subscriberClient = new PubSub.v1.SubscriberClient(options);

function createTopic(topicName) {
  const topic = pubsubClient.topic(topicName);
  return topic
    .exists()
    .then(([exists]) => {
      if (exists) {
        return Promise.reject(`Topic '${topicName}' exists`);
      }
    })
    .then(() => pubsubClient.createTopic(topicName))
    .then(() => {
      console.log(`Create topic: ${topicName} successfully`);
    })
    .catch((error) => {
      console.log(error);
    });
}

function createSubscription(topicName, subName) {
  const subscription = pubsubClient.subscription(subName);

  return subscription
    .exists()
    .then(() => {
      if (exists) {
        return Promise.reject(`Subscription '${subName}' for topic '${topicName}' exists`);
      }
    })
    .then(() => pubsubClient.createSubscription(topicName, subName))
    .then(() => {
      console.log(`Create subscription:${subName} for topic:${topicName} successfully`);
    })
    .catch(console.log);
}

function publish(topicName, message, attributes) {
  const buf = genBufferMessage(message);

  return pubsubClient
    .topic(topicName)
    .publisher()
    .publish(buf, attributes)
    .then((messageId) => {
      console.info(`Message was published with ID: ${messageId}`);
    })
    .catch((error) => {
      console.error('Publish message failed.');
      console.error(error);
      return Promise.reject(error);
    });
}

function genBufferMessage(message) {
  let jsonString;
  if (typeof message === 'string') {
    jsonString = message;
  } else if (_.isPlainObject(message)) {
    jsonString = JSON.stringify(message);
  } else {
    throw new TypeError('Wrong data type');
  }
  const dataBuffer = Buffer.from(jsonString);
  return dataBuffer;
}

function pull(subName, maxMessages) {
  const projectId = config.PROJECT_ID;
  if (!projectId) {
    console.error('projectId is required');
  }
  const request = {
    subscription: `projects/${projectId}/subscriptions/${subName}`,
    maxMessages,
    returnImmediately: true
  };

  return subscriberClient
    .pull(request)
    .then((responses) => {
      const response = responses[0];
      let messages = [];
      if (response.receivedMessages) {
        console.log('receivedMessages: ', response.receivedMessages);
        messages = response.receivedMessages.map(({ ackId, message }) => {
          const dataBase64 = message.data ? message.data : message;
          const dataString = Buffer.from(dataBase64, 'base64').toString();
          try {
            message.data = JSON.parse(dataString);
          } catch (error) {
            message.data = dataString;
          }
          message.ackId = ackId;
          return message;
        });
      }
      return messages;
    })
    .catch(console.error);
}

module.exports = { createTopic, createSubscription, pubsubClient, publish, pull };
