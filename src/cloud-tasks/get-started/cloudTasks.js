const cloudTasks = require('@google-cloud/tasks');

async function createQueue(
  project = '', // Your GCP Project id
  queue = '', // Name of the Queue to create
  location = '', // The GCP region in which to create the queue,
  service = ''
) {
  // Instantiates a client.
  const client = new cloudTasks.CloudTasksClient();

  // Send create queue request.
  const [response] = await client.createQueue({
    // The fully qualified path to the location where the queue is created
    parent: client.locationPath(project, location),
    queue: {
      // The fully qualified path to the queue
      name: client.queuePath(project, location, queue),
      appEngineHttpQueue: {
        appEngineRoutingOverride: {
          // The App Engine service that will receive the tasks.
          service
        }
      }
    }
  });
  console.log(`Created queue ${response.name}`);
}

/**
 * Create a task for a given queue with an arbitrary payload.
 */
async function createTask(project, location, queue, options) {
  const client = new cloudTasks.CloudTasksClient();

  // Construct the fully qualified queue name.
  const parent = client.queuePath(project, location, queue);

  const task = {
    appEngineHttpRequest: {
      httpMethod: 'POST',
      relativeUri: '/log_payload'
    }
  };

  if (options.payload !== undefined) {
    task.appEngineHttpRequest.body = Buffer.from(options.payload).toString('base64');
  }

  if (options.inSeconds !== undefined) {
    task.scheduleTime = {
      seconds: options.inSeconds + Date.now() / 1000
    };
  }

  const request = {
    parent: parent,
    task: task
  };

  console.log('Sending task %j', task);
  // Send create task request.
  const [response] = await client.createTask(request);
  const name = response.name;
  console.log(`Created task ${name}`);
}

/**
 * Delete a given Queue
 */
async function deleteQueue(
  project = '', // Your GCP Project id
  queue = '', // Name of the Queue to create
  location = '' // The GCP region in which to create the queue,
) {
  const client = new cloudTasks.CloudTasksClient();

  // Get the fully qualified path to the queue
  const name = client.queuePath(project, location, queue);

  // Send delete queue request.
  await client.deleteQueue({ name });
  console.log(`Deleted queue '${queue}'.`);
}

module.exports = {
  createQueue,
  deleteQueue,
  createTask
};
