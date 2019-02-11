const credentials = {
  PROJECT_ID: process.env.GCLOUD_PROJECT,
  KEY_FILE_NAME: process.env.KEY_FILE_NAME
};
console.log('credentials: ', credentials);

module.exports = credentials;
