exports.batchMultipleMessage2 = (event, callback) => {
  const pubsubMessage = event.data;
  const data = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('batchMultipleMessage2 channel:', data.channel);
  if (data.channel !== 'fuckbook') {
    callback();
    return;
  }
  console.log('fuckbook data:', data);
  callback();
};
