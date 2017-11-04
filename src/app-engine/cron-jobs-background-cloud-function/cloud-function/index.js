function cronJobsBackgroundFunction(event, callback) {
  const pubsubMessage = event.data;
  const data = Buffer.from(pubsubMessage.data).toString();
  const msg = Buffer.from(data).toString();
  console.log('data: ', data);
  callback();
}

exports.cronJobsBackgroundFunction = cronJobsBackgroundFunction;
