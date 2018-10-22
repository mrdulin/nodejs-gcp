const { retrieveMetaData } = require('./metadata');

async function retrieveComputeMetadata(req, res) {
  const envVars = await retrieveMetaData();
  console.log('envVars: ', envVars);
  res.status(200).json(envVars);
}

exports.retrieveComputeMetadata = retrieveComputeMetadata;
