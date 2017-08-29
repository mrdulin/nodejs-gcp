const request = require('request-promise');
require('dotenv').config();

function getMetaData(attr) {
  if (!attr) {
    return attr;
  }
  const METADATA_URL = 'http://metadata.google.internal/computeMetadata/v1/project/';
  const options = {
    headers: {
      'Metadata-Flavor': 'Google'
    }
  };

  return process.env.NODE_ENV === 'production'
    ? request(`${METADATA_URL}${attr}`, options).catch(error => {
        console.log('Get metadata error.', error);
        return '';
      })
    : Promise.resolve('');
}

async function getEnvVars(attr, envVar, defaultVal) {
  return (await getMetaData(attr)) || process.env[envVar] || defaultVal;
}

async function setEnvVars() {
  return {
    PROJECT_ID: await getEnvVars('project-id', 'projectId', ''),
    CREDENTIALS: await getEnvVars('', 'credentials', ''),
    NODE_ENV: await getEnvVars('', 'NODE_ENV', 'development')
  };
}

module.exports = { getMetaData, getEnvVars, setEnvVars };
