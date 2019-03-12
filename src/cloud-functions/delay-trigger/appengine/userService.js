const _ = require('lodash');

const pubsub = require('./pubsub');
const { config } = require('./config');

function UserService() {
  const maxMessages = 5;
  function createUser() {
    console.log('create user');

    pubsub.pull(config.PUBSUB.MESSAGE_PROCESS_SUBSCRIPTION, maxMessages).then((messages) => {
      console.log('messages: ', JSON.stringify(messages, null, 2));
    });

    // _.delay(createUser, config.CREATE_USER_SCHEDULER);
  }

  return {
    createUser
  };
}

const userSvc = new UserService();
userSvc.createUser();

module.exports = UserService;
