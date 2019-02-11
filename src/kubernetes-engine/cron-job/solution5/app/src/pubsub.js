const { PubSub } = require('@google-cloud/pubsub');

const credentials = require('./credentials');

const pubsub = new PubSub({
  projectId: credentials.PROJECT_ID,
  keyFilename: credentials.KEY_FILE_NAME
});

module.exports = { pubsub };
