const _ = require('lodash');

const pubsub = require('./pubsub');
const { config } = require('./config');

function UserService() {
  const maxMessages = 1;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function createUser() {
    console.log('create user task start.');

    return pubsub
      .pull(config.PUBSUB.MESSAGE_PROCESS_SUBSCRIPTION, maxMessages)
      .then((messages) => {
        const message = messages[0];
        if (message) {
          return message;
        }
        return Promise.reject('No create user message found.');
      })
      .then((message) => {
        return pubsub.publish(config.PUBSUB.CREATE_USER_TOPIC, message.data, message.attributes).then(() => message);
      })
      .then((message) => {
        const projectId = config.PROJECT_ID;
        if (!projectId) {
          return Promise.reject('projectId is required');
        }
        const request = {
          subscription: `projects/${projectId}/subscriptions/${config.PUBSUB.MESSAGE_PROCESS_SUBSCRIPTION}`,
          ackIds: [message.ackId]
        };

        return pubsub.subscriberClient
          .acknowledge(request)
          .then(() => {
            console.log('create user message acked.');
          })
          .catch((error) => {
            console.error(`subscribeClient acknowledge message error.`);
            return Promise.reject(error);
          });
      })
      .then(() => {
        console.log('create user task done.');
      })
      .catch(console.log);
  }

  async function createUserTimeSeries(callback) {
    await createUser();
    await sleep(config.CREATE_USER_SCHEDULER);
    callback();
  }

  return {
    createUser,
    createUserTimeSeries
  };
}

// const userSvc = new UserService();
// userSvc.createUser();

module.exports = UserService;
