const request = require('request-promise');

async function getMetaData(attr) {
  const url = `http://metadata.google.internal/computeMetadata/v1/project/attributes/${attr}`;
  const options = {
    headers: {
      'Metadata-Flavor': 'Google'
    }
  };
  return request(url, options)
    .then(response => {
      console.info(`Retrieve meta data successfully. meta data: ${response.body}`);
      return response.body;
    })
    .catch(err => {
      console.error('Retrieve meta data failed.', err);
    });
}

async function retrieveMetaData() {
  return {
    IT_EBOOKS_API: await getMetaData('IT_EBOOKS_API')
  };
}

module.exports = { getMetaData, retrieveMetaData };
