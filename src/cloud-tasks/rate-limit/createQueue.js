async function createQueue(project = '', queue = '', location = '', service = '') {
  const cloudTasks = require('@google-cloud/tasks');
  const client = new cloudTasks.CloudTasksClient();

  const [response] = await client.createQueue({
    parent: client.locationPath(project, location),
    queue: {
      name: client.queuePath(project, location, queue),
      appEngineHttpQueue: {
        appEngineRoutingOverride: {
          service
        }
      },
      rateLimits: {
        maxDispatchesPerSecond: 1,
        maxConcurrentDispatches: 1
      }
    }
  });
  console.log(`Created queue ${response.name}`);
}

if (require.main === module) {
  const envVars = require('./env');
  createQueue(envVars.PROJECT_ID, envVars.queue, envVars.location, envVars.service).catch(console.error);
}

module.exports = createQueue;
