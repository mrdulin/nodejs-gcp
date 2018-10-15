function nestedData(event, callback) {
  const pubsubMessage = event.data;
  console.log('pubsubMessage: ', pubsubMessage);
  const message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('message:', message);
  console.log('user.ips.ip1: ', message.body.user.ips.ip1);

  callback();
}

exports.nestedData = nestedData;
