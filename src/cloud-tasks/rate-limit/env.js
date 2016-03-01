const dotenv = require('dotenv');
const path = require('path');

const dotenvOutput = dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

if (dotenvOutput.Error) {
  throw dotenvOutput.Error;
}

const envVars = {
  PROJECT_ID: process.env.PROJECT_ID,
  queue: 'create-user',
  location: 'asia-northeast1',
  service: 'cloud-tasks-rate-limit'
};

module.exports = envVars;
