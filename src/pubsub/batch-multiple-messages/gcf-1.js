exports.batchMultipleMessage = (event, callback) => {
  const pubsubMessage = event.data;
  const data = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('batchMultipleMessage channel:', data.channel);
  if (data.channel !== 'google') {
    callback();
    return;
  }
  console.log('google data:', data);
  callback();
};
