function cronJobsBackgroundFunction(event, callback) {
  const pubsubMessage = event.data;
  const data = Buffer.from(pubsubMessage.data, 'base64').toString();
  console.log('data: ', data);
  callback();
}

exports.cronJobsBackgroundFunction = cronJobsBackgroundFunction;
