const request = require('request-promise');

async function getMetaData(attr) {
  const url = `http://metadata.google.internal/computeMetadata/v1beta/project/attributes/${attr}`;
  // const url = `http://metadata/computeMetadata/v1/project/attributes/${attr}`;
  const options = {
    headers: {
      'Metadata-Flavor': 'Google'
    }
  };
  console.log('url:', url);
  return request(url, options)
    .then((response) => {
      console.info(`Retrieve meta data successfully. meta data: ${response}`);
      return response;
    })
    .catch((err) => {
      console.error('Retrieve meta data failed.', err);
      return '';
    });
}

const METADATA_PROJECT_ID_URL = 'http://metadata.google.internal/computeMetadata/v1/project/project-id';

async function getProjectId() {
  const options = {
    headers: {
      'Metadata-Flavor': 'Google'
    }
  };

  return request(METADATA_PROJECT_ID_URL, options)
    .then((response) => {
      console.log('response: ', response);
      return response;
    })
    .catch((err) => {
      if (err && err.statusCode !== 200) {
        console.log('Error while talking to metadata server.');
        return 'Unknown_Project_ID';
      }
      return Promise.reject(err);
    });
}

async function retrieveMetaData() {
  return {
    IT_EBOOKS_API: await getMetaData('IT_EBOOKS_API'),
    PROJECT_ID: await getProjectId().catch(() => 'error'),
    API_KEY: await getMetaData('API_KEY')
  };
}

module.exports = { getMetaData, retrieveMetaData };
