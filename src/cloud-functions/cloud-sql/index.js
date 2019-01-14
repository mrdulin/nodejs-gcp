const { connection: knex } = require('./db');

exports.schedulerWorker = (event, callback) => {
  const pubsubMessage = event.data;
  const messageString = pubsubMessage.data ? Buffer.from(pubsubMessage.data, 'base64').toString() : {};
  const message = JSON.parse(messageString);
  console.log('message: ', message);

  knex('USER')
    .select()
    .where({ user_id: message.user_id })
    .then((users) => {
      console.log('users: ', users);
    })
    .catch((error) => {
      console.error('Get users failed.');
      console.error(error);
    })
    .then(() => {
      callback();
    });
};
