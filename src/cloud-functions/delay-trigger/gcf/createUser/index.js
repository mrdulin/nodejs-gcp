const request = require('request-promise');

const pubsub = require('../pubsub');
const { config, MESSAGE_PROCESS_TOPIC } = require('../config');

const UserService = {
  CREATE_USER_RATE_LIMIT_ERROR: 'Too many users created from this IP, please try again after 30 seconds',

  createUser(user) {
    const url = `https://third-party-service-dot-${config.PROJECT_ID}.appspot.com/create-user`;
    const options = { method: 'POST', url, body: user, json: true };
    return request(options).catch((error) => {
      return Promise.reject(error.message);
    });
  }
};

const createUser = (event, callback) => {
  const pubsubMessage = event.data;
  const message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('message: ', message);

  UserService.createUser(message)
    .then(() => {
      console.log('create user successfully.');
    })
    .catch((error) => {
      console.log('create user failed.');
      if (error.indexOf(UserService.CREATE_USER_RATE_LIMIT_ERROR) !== -1) {
        console.log('Add create user task to task queue.');
        return pubsub.publish(MESSAGE_PROCESS_TOPIC, message).catch((error) => {
          // TODO: store user to Datastore
          return Promise.reject(error);
        });
      }
    })
    .then(() => callback())
    .catch(callback);
};

module.exports = createUser;
