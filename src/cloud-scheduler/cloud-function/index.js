exports.schedulerJob = (event, callback) => {
  let message;
  try {
    const pubsubMessage = event.data;
    message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
    console.log('message:', message);
  } catch (error) {
    console.error('JSON parse message failed.');
    console.error(error);
  }

  callback();
};
