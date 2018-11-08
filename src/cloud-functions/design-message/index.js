function designMessage(event, callback) {
  const pubsubMessage = event.data;
  console.log('pubsubMessage:', pubsubMessage);

  if (pubsubMessage.attributes.type !== 'UPDATE') {
    console.log('Operation type is not matched. ');
    return callback();
  }

  const message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('message:', message);

  callback();
}

exports.designMessage = designMessage;
