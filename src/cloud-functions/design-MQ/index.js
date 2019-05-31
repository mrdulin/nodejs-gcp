function updateCampaign(data, context, callback) {
  const pubsubMessage = data;
  console.log('pubsubMessage: ', JSON.stringify(pubsubMessage));

  if (pubsubMessage.attributes.type !== 'UPDATE') {
    return callback(new Error('Operation type is not matched.'));
  }

  const message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('message:', message);

  callback();
}

function createCampaign(data, context, callback) {
  const pubsubMessage = data;
  console.log('pubsubMessage: ', JSON.stringify(pubsubMessage));

  if (pubsubMessage.attributes.type !== 'CREATE') {
    return callback(new Error('Operation type is not matched. '));
  }
  const message = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  console.log('message:', message);

  callback();
}

exports.updateCampaign = updateCampaign;
exports.createCampaign = createCampaign;
