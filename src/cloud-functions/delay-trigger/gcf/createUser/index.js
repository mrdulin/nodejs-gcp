const createUser = (event, callback) => {
  const pubsubMessage = event.data;
  const message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());

  console.log('message: ', message);

  callback();
};

module.exports = createUser;
