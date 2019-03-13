const _ = require('lodash');

const pubsub = require('./pubsub');
const { config } = require('./config');

function UserService() {
  const maxMessages = 1;
  function createUser() {
    console.log('create user');

    return pubsub
      .pull(config.PUBSUB.MESSAGE_PROCESS_SUBSCRIPTION, maxMessages)
      .then((messages) => {
        const message = messages[0];
        if (message) {
          return message;
        }
        return Promise.reject('No message.');
      })
      .then((message) => pubsub.publish(config.PUBSUB.CREATE_USER_TOPIC, message.data, message.attributes))
      .catch(console.log);

    // _.delay(createUser, config.CREATE_USER_SCHEDULER);
  }

  return {
    createUser
  };
}

// const userSvc = new UserService();
// userSvc.createUser();

module.exports = UserService;
