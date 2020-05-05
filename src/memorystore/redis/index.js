const path = require('path');
const { CloudRedisClient } = require('@google-cloud/redis');

(async function main(projectId, location) {
  const client = new CloudRedisClient({
    keyFilename: path.resolve(__dirname, '../../../.gcp/memorystore-admin.json'),
  });
  console.log(projectId, location);
  const formattedParent = client.locationPath(projectId, location);
  const request = {
    parent: formattedParent,
  };
  try {
    const instances = await client.listInstances(request);
    console.log(instances);
  } catch (error) {
    console.log(error);
  }
})(process.env.PROJECT_ID, 'us-east1');
